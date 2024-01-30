import {View, Image, Modal, SafeAreaView, Pressable} from 'react-native';
import {BoldText, RegularText} from '@/components';
import {useNavigation} from '@/hooks';
import {Theme} from '@/constants';

export default function NewOrderModal({
  visible,
  setVisible,
  prices,
  tip,
}: {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  prices: {
    subtotal: number;
    discount: number;
    storeCredit: number;
    deliveryFee: number;
    tax: number;
    total: number;
  };
  tip: number;
}): JSX.Element {
  const navigation = useNavigation();

  return (
    <Modal visible={visible} animationType="slide">
      <View
        style={{
          height: '100%',
          width: '100%',
          backgroundColor: Theme.main.secondary,
        }}>
        <SafeAreaView>
          <View
            style={{
              width: '100%',
              height: '100%',
              paddingHorizontal: 40,
              display: 'flex',
              flexDirection: 'column',
            }}>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
              }}>
              <Image
                source={require('@/assets/img/wordmark.png')}
                style={{
                  width: '50%',
                  height: 32,
                  resizeMode: 'contain',
                }}
              />
            </View>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
              }}>
              <View
                style={{
                  width: '100%',
                  backgroundColor: 'white',
                  borderRadius: 32,
                  minHeight: 200,
                }}>
                <View
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    alignItems: 'center',
                    display: 'flex',
                    paddingTop: 16,
                  }}>
                  <BoldText style={{fontSize: 32}}>👍</BoldText>
                  <BoldText
                    style={{
                      paddingHorizontal: 30,
                      fontSize: 20,
                      color: Theme.text.primary,
                      textAlign: 'center',
                      paddingTop: 24,
                    }}>
                    Your order has been confirmed
                  </BoldText>
                </View>
                <View
                  style={{
                    marginTop: 32,
                    display: 'flex',
                    flexDirection: 'column',
                    paddingHorizontal: 48,
                  }}>
                  <LineItem
                    title="Subtotal"
                    value={
                      '$' +
                      (
                        prices.subtotal +
                        prices.storeCredit +
                        prices.discount
                      ).toFixed(2)
                    }
                  />
                  {prices.discount ? (
                    <LineItem
                      title="Discount"
                      value={'-$' + prices.discount.toFixed(2)}
                    />
                  ) : (
                    <></>
                  )}
                  {prices.storeCredit ? (
                    <LineItem
                      title="Store Credit"
                      value={'-$' + prices.storeCredit.toFixed(2)}
                    />
                  ) : (
                    <></>
                  )}

                  <LineItem title="Tip" value={'$' + tip.toFixed(2)} />
                  <LineItem
                    title="Delivery Fee"
                    value={'$' + prices.deliveryFee.toFixed(2)}
                  />
                  <LineItem title="Taxes" value={'$' + prices.tax.toFixed(2)} />
                </View>
                <View
                  style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                    marginBottom: 9,
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      height: 56,
                      width: 28,
                      borderTopRightRadius: 100,
                      borderBottomRightRadius: 100,
                      marginRight: 12,
                      backgroundColor: Theme.main.secondary,
                    }}
                  />
                  <View
                    style={{
                      flex: 1,
                      height: 1,
                      width: '100%',
                      borderStyle: 'dashed',
                      borderColor: Theme.text.secondary,
                      borderWidth: 1,
                    }}
                  />
                  <View
                    style={{
                      height: 56,
                      width: 28,
                      borderTopLeftRadius: 100,
                      borderBottomLeftRadius: 100,
                      marginLeft: 12,
                      backgroundColor: Theme.main.secondary,
                    }}
                  />
                </View>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: 32,
                  }}>
                  <RegularText
                    crack
                    style={{
                      color: Theme.text.secondary,
                      fontSize: 16,
                    }}>
                    Total
                  </RegularText>
                  <BoldText
                    style={{
                      fontSize: 26,
                      color: Theme.text.primary,
                    }}>
                    ${(prices.total + tip).toFixed(2)}
                  </BoldText>
                </View>
              </View>
            </View>
            <View
              style={{
                height: 103,
                marginBottom: 32,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}>
              <Pressable
                onPress={() => {
                  setVisible(false);
                  navigation.navigate('PastOrders');
                }}
                style={{
                  height: 56,
                  width: '100%',
                  borderRadius: 56,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: Theme.text.primary,
                }}>
                <BoldText style={{color: 'white', fontSize: 20}}>
                  Track Order
                </BoldText>
              </Pressable>
              <Pressable
                onPress={() => {
                  setVisible(false);
                  navigation.navigate('Home');
                }}
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  display: 'flex',
                  flexDirection: 'row',
                }}>
                <BoldText
                  style={{
                    color: Theme.text.primary,
                    fontSize: 20,
                    textDecorationLine: 'underline',
                  }}>
                  Back to Home
                </BoldText>
              </Pressable>
            </View>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );

  function LineItem({title, value}: {title: string; value: string}) {
    return (
      <View
        style={{
          flexDirection: 'row',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 12,
        }}>
        <RegularText crack style={{color: Theme.text.secondary, fontSize: 16}}>
          {title}
        </RegularText>
        <BoldText style={{fontSize: 16, color: Theme.text.primary}}>
          {value}
        </BoldText>
      </View>
    );
  }
}
