import {Dimensions, Modal, Pressable, View} from 'react-native';
import React, {ReactNode} from 'react';

/**
 * Action sheet component
 * @param {ReactNode} children - Action sheet children
 * @param {boolean} open - Action sheet open state
 * @param {function} setOpen - Action sheet open state setter
 * @returns {JSX.Element}
 */
export function ActionSheet({
  children,
  open,
  setOpen,
}: {
  children: ReactNode;
  open: boolean;
  setOpen: (value: boolean) => void;
}): JSX.Element {
  return (
    <Modal animationType="slide" transparent={true} visible={open}>
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').height,
          display: 'flex',
          flexDirection: 'column',
        }}>
        <Pressable
          onPress={() => {
            setOpen(false);
          }}
          style={{flex: 1}}
        />
        <View
          style={{
            backgroundColor: 'white',
            borderTopRightRadius: 32,
            borderTopLeftRadius: 32,
            padding: 20,
            minHeight: 300,
          }}>
          {children}
        </View>
      </View>
    </Modal>
  );
}
