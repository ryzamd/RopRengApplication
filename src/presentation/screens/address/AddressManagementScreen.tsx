import { APP_DEFAULT_LOCATION } from "@/src/core/config/locationConstants";
import { locationService } from "@/src/infrastructure/services";
import { ILocationCoordinate } from "@/src/infrastructure/services/LocationService";
import { useAddressSearch } from "@/src/utils/hooks/useAddressSearch";
import { Camera, CameraRef, UserLocation } from "@maplibre/maplibre-react-native";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { IAddressSuggestion } from "../../../domain/models/LocationModel";
import { GoongGeocodingRepository } from "../../../infrastructure/repositories/GoongGeocodingRepository";
import { setDeliveryAddress } from "../../../state/slices/delivery";
import { RootState } from "../../../state/store";
import { GoongMapView } from "../../components/map/GoongMapView";
import { MapSearchBar } from "../../components/map/MapSearchBar";
import { AppIcon } from "../../components/shared/AppIcon";
import { BRAND_COLORS } from "../../theme/colors";

const repo = new GoongGeocodingRepository();
const DEBOUNCE_MS = 400;
const MIN_DISTANCE_THRESHOLD = 0.0001;

type MapLoadingState = "loading" | "ready" | "error";

interface GeocodingState {
  isLoading: boolean;
  error: string | null;
}

export default function AddressManagementScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const cameraRef = useRef<CameraRef>(null);

  const savedAddress = useSelector((state: RootState) => state.delivery.selectedAddress);

  const { suggestions, isLoading, onSearch, onSelectAddress, sessionToken, refreshSessionToken } = useAddressSearch();

  const [selectedLocation, setSelectedLocation] = useState<ILocationCoordinate | null>(null);
  const [addressString, setAddressString] = useState("");
  const [searchBarValue, setSearchBarValue] = useState("");
  const [initialRegion, setInitialRegion] = useState<[number, number]>();
  const [mapState, setMapState] = useState<MapLoadingState>("loading");
  const [geocodingState, setGeocodingState] = useState<GeocodingState>({
    isLoading: false,
    error: null,
  });

  const abortControllerRef = useRef<AbortController | null>(null);
  const requestIdRef = useRef<number>(0);

  const selectedLocationRef = useRef<ILocationCoordinate | null>(null);
  useEffect(() => {
    selectedLocationRef.current = selectedLocation;
  }, [selectedLocation]);

  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const initLocation = async () => {
      try {
        if (savedAddress?.coordinates) {
          const coords: [number, number] = [savedAddress.coordinates.longitude, savedAddress.coordinates.latitude];

          console.log("[AddressManagement] INIT from Redux:", {
            lat: savedAddress.coordinates.latitude,
            lng: savedAddress.coordinates.longitude,
            address: savedAddress.addressString,
          });

          setInitialRegion(coords);
          setSelectedLocation(savedAddress.coordinates);
          setAddressString(savedAddress.addressString);
          setSearchBarValue(savedAddress.addressString);
          return;
        }

        const location = await locationService.getCurrentPosition();

        const coords: [number, number] = [location.longitude, location.latitude];
        setInitialRegion(coords);
        setSelectedLocation(location);

        setGeocodingState({ isLoading: true, error: null });

        try {
          const address = await repo.reverseGeocode(location);
          setAddressString(address);
          setSearchBarValue(address);
          setGeocodingState({ isLoading: false, error: null });
        } catch (error: any) {
          console.error("[AddressManagement] Reverse geocode failed:", error);
          setGeocodingState({
            isLoading: false,
            error: error?.message || "Không thể xác định địa chỉ",
          });
        }
      } catch (error) {
        console.log("[AddressManagement] GPS Error:", error);
        setInitialRegion([APP_DEFAULT_LOCATION.longitude, APP_DEFAULT_LOCATION.latitude]);
      }
    };

    initLocation();
  }, [savedAddress]);

  const handleSelectSuggestion = async (item: IAddressSuggestion) => {
    try {
      setSearchBarValue(item.description);
      setAddressString(item.description);
      onSelectAddress(item);
      setGeocodingState({ isLoading: true, error: null });

      const coords = await repo.getPlaceDetail(item.place_id, sessionToken);
      refreshSessionToken();

      setSelectedLocation(coords);
      setGeocodingState({ isLoading: false, error: null });

      cameraRef.current?.setCamera({
        centerCoordinate: [coords.longitude, coords.latitude],
        zoomLevel: 16,
        animationDuration: 1000,
      });
    } catch (error) {
      console.error("[AddressManagement] Select suggestion error:", error);
      setGeocodingState({ isLoading: false, error: "Không thể lấy thông tin địa điểm" });
    }
  };

  const onRegionDidChange = useCallback((feature: any) => {
    const { isUserInteraction = false, animated = false } = feature.properties || {};

    if (!isUserInteraction || animated) {
      console.log("[AddressManagement] Skipping - programmatic move:", { isUserInteraction, animated });
      return;
    }

    const [lng, lat] = feature.geometry.coordinates;

    const currentLocation = selectedLocationRef.current;
    if (currentLocation) {
      const dist = Math.sqrt(
        Math.pow(lng - currentLocation.longitude, 2) + Math.pow(lat - currentLocation.latitude, 2),
      );
      if (dist < MIN_DISTANCE_THRESHOLD) return;
    }

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(async () => {
      abortControllerRef.current?.abort();
      abortControllerRef.current = new AbortController();

      const currentRequestId = ++requestIdRef.current;

      setGeocodingState({ isLoading: true, error: null });

      try {
        const newAddress = await repo.reverseGeocode({ latitude: lat, longitude: lng });

        if (currentRequestId !== requestIdRef.current) {
          console.log("[AddressManagement] Stale response ignored:", currentRequestId);
          return;
        }

        setAddressString(newAddress);
        setSelectedLocation({ latitude: lat, longitude: lng });
        setGeocodingState({ isLoading: false, error: null });
      } catch (error: any) {
        if (error?.name === "AbortError") {
          console.log("[AddressManagement] Request aborted");
          return;
        }

        if (currentRequestId !== requestIdRef.current) return;

        console.error("[AddressManagement] Reverse geocode error:", error);
        setGeocodingState({ isLoading: false, error: "Không thể xác định địa chỉ" });
      }
    }, DEBOUNCE_MS);
  }, []);

  const onGoToMyLocation = async () => {
    try {
      const location = await locationService.getCurrentPosition();

      cameraRef.current?.setCamera({
        centerCoordinate: [location.longitude, location.latitude],
        zoomLevel: 15,
        animationDuration: 1000,
      });
    } catch (error) {
      console.log("[AddressManagement] Error getting location:", error);
      setGeocodingState((prev) => ({ ...prev, error: "Không thể lấy vị trí hiện tại" }));
    }
  };

  const onConfirm = () => {
    if (!selectedLocation) return;

    console.log("[AddressManagement] CONFIRM button pressed:", {
      lat: selectedLocation.latitude,
      lng: selectedLocation.longitude,
      address: addressString,
    });

    dispatch(
      setDeliveryAddress({
        addressString: addressString,
        coordinates: selectedLocation,
      }),
    );

    router.back();
  };

  const onBack = () => {
    router.back();
  };

  const handleMapReady = () => {
    console.log("[AddressManagement] Map ready");
    setMapState("ready");

    // Set initial camera position imperatively instead of defaultSettings
    // This prevents any "snap back" behavior from prop-based reactivity
    if (initialRegion) {
      cameraRef.current?.setCamera({
        centerCoordinate: initialRegion,
        zoomLevel: 15,
        animationDuration: 0, // No animation on init
      });
    }
  };

  const clearError = () => {
    setGeocodingState((prev) => ({ ...prev, error: null }));
  };

  const isConfirmDisabled = !selectedLocation || geocodingState.isLoading;
  const showMapLoading = mapState === "loading" || !initialRegion;

  return (
    <View style={styles.container}>
      {showMapLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={BRAND_COLORS.primary.xanhReu} />
          <Text style={styles.loadingText}>Đang tải bản đồ...</Text>
        </View>
      )}

      {initialRegion && (
        <GoongMapView
          style={[styles.map, showMapLoading && styles.hiddenMap]}
          onRegionDidChange={onRegionDidChange}
          onMapReady={handleMapReady}
        >
          <Camera
            ref={cameraRef}
            // No defaultSettings - camera position controlled via setCamera() only
          />
          <UserLocation visible={true} />
        </GoongMapView>
      )}

      <View style={styles.centerMarkerContainer} pointerEvents="none">
        <View style={styles.markerPin}>
          <AppIcon name="location" size={32} color={BRAND_COLORS.primary.beSua} />
        </View>
        <View style={styles.markerShadow} />
      </View>

      <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.8}>
        <AppIcon name="arrow-back" size={20} color={BRAND_COLORS.text.primary} />
      </TouchableOpacity>

      <MapSearchBar
        suggestions={suggestions}
        isLoading={isLoading}
        onSearch={onSearch}
        onSelectSuggestion={handleSelectSuggestion}
        initialValue={searchBarValue}
      />

      <TouchableOpacity style={styles.myLocationBtn} onPress={onGoToMyLocation} activeOpacity={0.8}>
        <AppIcon name="location-sharp" size={22} color={BRAND_COLORS.primary.xanhReu} />
      </TouchableOpacity>

      {geocodingState.error && (
        <TouchableOpacity style={styles.errorToast} onPress={clearError} activeOpacity={0.9}>
          <Text style={styles.errorText}>{geocodingState.error}</Text>
          <Text style={styles.errorDismiss}>Nhấn để đóng</Text>
        </TouchableOpacity>
      )}

      <View style={styles.footer}>
        <View style={styles.addressPreview}>
          <Text style={styles.label}>ĐỊA CHỈ GIAO HÀNG</Text>
          <View style={styles.addressRow}>
            <Text style={styles.addressText} numberOfLines={2}>
              {geocodingState.isLoading
                ? "Đang xác định vị trí..."
                : addressString || "Di chuyển bản đồ để chọn địa chỉ"}
            </Text>
            {geocodingState.isLoading && (
              <ActivityIndicator size="small" color={BRAND_COLORS.primary.xanhReu} style={styles.addressLoader} />
            )}
          </View>
        </View>

        <TouchableOpacity
          style={[styles.btnConfirm, isConfirmDisabled && styles.btnDisabled]}
          onPress={onConfirm}
          disabled={isConfirmDisabled}
          activeOpacity={0.8}
        >
          <Text style={styles.btnText}>Xác nhận địa chỉ này</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#666666",
  },
  hiddenMap: {
    opacity: 0,
  },
  map: {
    flex: 1,
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 16,
    zIndex: 20,
    width: 44,
    height: 44,
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
  centerMarkerContainer: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginLeft: -22,
    marginTop: -54,
    zIndex: 5,
    alignItems: "center",
  },
  markerPin: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: BRAND_COLORS.primary.xanhReu,
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
  },
  markerShadow: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "rgba(0,0,0,0.2)",
    marginTop: 4,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 34,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -4 },
  },
  addressPreview: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    color: "#888888",
    fontWeight: "600",
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  addressText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
    lineHeight: 22,
  },
  addressLoader: {
    marginLeft: 8,
  },
  btnConfirm: {
    backgroundColor: BRAND_COLORS.primary.xanhReu,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  btnDisabled: {
    backgroundColor: "#CCCCCC",
  },
  btnText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
  },
  myLocationBtn: {
    position: "absolute",
    bottom: 200,
    right: 20,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    zIndex: 10,
  },
  errorToast: {
    position: "absolute",
    top: 110,
    left: 16,
    right: 16,
    backgroundColor: "#FF4444",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    zIndex: 30,
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
  errorText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  errorDismiss: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
    marginTop: 4,
  },
});
