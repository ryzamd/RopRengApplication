import { BottomSheetBackdrop, BottomSheetModal, BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { BottomSheetDefaultBackdropProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BRAND_COLORS } from '../../../theme/colors';
import { ADDRESS_MANAGEMENT_TEXT } from '../AddressManagementConstants';
import { AddressLabelModalProps } from '../AddressManagementInterfaces';
import { ADDRESS_MANAGEMENT_LAYOUT } from '../AddressManagementLayout';
import { AddressManagementService } from '../AddressManagementService';

export function AddressLabelModal({
  visible,
  initialLabel = '',
  onSave,
  onCancel,
}: AddressLabelModalProps) {
  const insets = useSafeAreaInsets();
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [label, setLabel] = useState(initialLabel);

  const snapPoints = useMemo(() => ['90%'], []);

  useEffect(() => {
    if (visible) {
      setLabel(initialLabel);
      bottomSheetRef.current?.present();
    } else {
      bottomSheetRef.current?.dismiss();
    }
  }, [visible, initialLabel]);

  const handleSave = () => {
    const validation = AddressManagementService.validateLabel(label);
    
    if (!validation.valid) {
      alert(validation.error);
      return;
    }

    onSave(label.trim());
    bottomSheetRef.current?.dismiss();
  };

  const handleSuggestedLabel = (suggestedLabel: string) => {
    setLabel(suggestedLabel);
  };

  const renderBackdrop = useCallback(
    (props: BottomSheetDefaultBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.5}
        pressBehavior="close"
      />
    ),
    []
  );

  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) {
        onCancel();
      }
    },
    [onCancel]
  );

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
      onChange={handleSheetChanges}
      enablePanDownToClose={true}
      topInset={insets.top}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
    >
      <View style={styles.container}>
        <Text style={styles.title}>{ADDRESS_MANAGEMENT_TEXT.LABEL_MODAL_TITLE}</Text>

        <BottomSheetTextInput
          style={styles.input}
          placeholder={ADDRESS_MANAGEMENT_TEXT.LABEL_PLACEHOLDER}
          value={label}
          onChangeText={setLabel}
          maxLength={50}
          autoFocus={true}
        />

        {/* Suggested Labels */}
        <View style={styles.suggestedContainer}>
          {AddressManagementService.getSuggestedLabels().map((suggested) => (
            <TouchableOpacity
              key={suggested}
              style={styles.suggestedChip}
              onPress={() => handleSuggestedLabel(suggested)}
              activeOpacity={0.7}
            >
              <Text style={styles.suggestedText}>{suggested}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={() => bottomSheetRef.current?.dismiss()}
            activeOpacity={0.7}
          >
            <Text style={styles.cancelButtonText}>{ADDRESS_MANAGEMENT_TEXT.LABEL_CANCEL}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.saveButton]}
            onPress={handleSave}
            activeOpacity={0.7}
          >
            <Text style={styles.saveButtonText}>{ADDRESS_MANAGEMENT_TEXT.LABEL_SAVE}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: ADDRESS_MANAGEMENT_LAYOUT.MODAL_PADDING,
    gap: 20,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Phudu-Bold',
    color: BRAND_COLORS.primary.xanhReu,
    textAlign: 'center',
  },
  input: {
    height: ADDRESS_MANAGEMENT_LAYOUT.MODAL_INPUT_HEIGHT,
    backgroundColor: BRAND_COLORS.background.default,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: 'SpaceGrotesk-Medium',
    color: BRAND_COLORS.text.primary,
    borderWidth: 1,
    borderColor: BRAND_COLORS.border.light,
  },
  suggestedContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  suggestedChip: {
    backgroundColor: BRAND_COLORS.primary.beSua,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  suggestedText: {
    fontSize: 14,
    fontFamily: 'SpaceGrotesk-Medium',
    color: BRAND_COLORS.primary.xanhReu,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 'auto',
  },
  button: {
    flex: 1,
    height: ADDRESS_MANAGEMENT_LAYOUT.MODAL_BUTTON_HEIGHT,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: BRAND_COLORS.border.light,
  },
  saveButton: {
    backgroundColor: BRAND_COLORS.primary.xanhReu,
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: 'Phudu-Bold',
    color: BRAND_COLORS.text.secondary,
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: 'Phudu-Bold',
    color: BRAND_COLORS.background.default,
  },
});