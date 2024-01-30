import {useState} from 'react';
import {
  View,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {RegularText} from '@/components';
import {WebView} from 'react-native-webview';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@/hooks';
import {track} from '@/api';
import {Theme} from '@/constants';

export default function PopPayModal({
  id,
  setModalVisible,
  modalVisible,
  onSuccess,
}: {
  id: string;
  setModalVisible: any;
  modalVisible: boolean;
  onSuccess: () => void;
}) {
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  function handleNavStateChange(navState: any) {
    if (loading && !navState.loading) {
      setLoading(false);
    }

    if (
      navState.url ===
        'https://www.popid.com/handle_order_status?status=success' &&
      !navState.loading
    ) {
      setLoading(false);
      setModalVisible(false);
      onSuccess();
    }
    if (
      navState.url ===
        'https://www.popid.com/handle_order_status?status=failed' &&
      !navState.loading
    ) {
      setLoading(false);
      Alert.alert(
        'Oops!',
        'PopPay has encountered an error. Please try your order again.',
        [
          {
            text: 'OK',
            onPress: () => {
              setModalVisible(false);
            },
          },
        ],
      );
    }
  }

  return (
    <Modal
      animationType="slide"
      visible={modalVisible}
      style={{
        flex: 1,
      }}>
      {loading ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ActivityIndicator
            size="large"
            color={Theme.other.poppayBackground}
            style={{
              zIndex: 0,
            }}
          />
        </View>
      ) : (
        <TouchableOpacity
          onPress={() => {
            track('Cancel poppay checkout');
            setLoading(true);
            setModalVisible(false);
          }}
          style={{
            backgroundColor: Theme.other.poppayBackground,
            width: 100,
            height: 50,
            borderRadius: 100,
            zIndex: 2,
            justifyContent: 'center',
            alignItems: 'center',
            top: insets.top + 16,
            left: 16,
            position: 'absolute',
          }}>
          <RegularText style={{color: 'white'}}>Cancel</RegularText>
        </TouchableOpacity>
      )}

      <WebView
        style={[
          loading
            ? {height: 1, width: 1, zIndex: 10}
            : {flex: 1, zIndex: 10, marginTop: insets.top},
        ]}
        source={{
          uri: `https://www.popid.com/check_code?o_id=${id}&location=438`,
        }}
        onNavigationStateChange={handleNavStateChange}
        onMessage={msg => {
          alert(msg);
        }}
      />
    </Modal>
  );
}
