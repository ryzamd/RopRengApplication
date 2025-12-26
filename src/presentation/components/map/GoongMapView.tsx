import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import { MapView, Camera } from '@maplibre/maplibre-react-native';
import { GOONG_CONFIG } from '../../../infrastructure/api/goong/GoongConfig';
import * as MapLibreGL from '@maplibre/maplibre-react-native';

MapLibreGL.setAccessToken(null);
MapLibreGL.setConnected(true);

interface GoongMapViewProps extends ViewProps {
  centerCoordinate?: [number, number];
  zoomLevel?: number;
  onMapReady?: () => void;
  onRegionDidChange?: (feature: any) => void;
  children?: React.ReactNode;
}

const DEFAULT_CENTER: [number, number] = [106.6297, 10.8231];

export const GoongMapView: React.FC<GoongMapViewProps> = ({
  centerCoordinate = DEFAULT_CENTER,
  zoomLevel = 14,
  onMapReady,
  onRegionDidChange,
  children,
  style,
  ...props
}) => {
  const styleUrl = `${GOONG_CONFIG.STYLE_URL}?api_key=${GOONG_CONFIG.MAP_TILES_KEY}`;
  const hasChildren = React.Children.count(children) > 0;

  return (
    <View style={[styles.container, style]} {...props}>
      <MapView
        style={styles.map}
        mapStyle={styleUrl}
        logoEnabled={false}
        attributionEnabled={true}
        onDidFinishLoadingMap={onMapReady}
        onRegionDidChange={onRegionDidChange}
      >
        {!hasChildren && (
          <Camera
            zoomLevel={zoomLevel}
            centerCoordinate={centerCoordinate}
            animationMode={'flyTo'}
            animationDuration={500}
          />
        )}
        {children}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
});