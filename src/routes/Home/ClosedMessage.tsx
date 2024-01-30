import {View, Image, ImageBackground} from 'react-native';
import {BoldText, Gutter} from '@/components';
import {useUniversity} from '@/hooks/useUniversity';
import {useEffect, useState} from 'react';
import {Theme} from '@/constants';

/**
 * The closed message component
 * @returns {JSX.Element}
 */
export function ClosedMessage(): JSX.Element {
  const university = useUniversity();
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    if (university.data && university.data?.data()?.open === false) {
      setClosed(true);
    } else if (university.data && university.data?.data()?.open === true) {
      setClosed(false);
    }
  }, [university.data]);

  return (
    <View style={{backgroundColor: Theme.common.white}}>
      {closed && (
        <Gutter>
          <ImageBackground
            source={require('@/assets/img/closed.png')}
            resizeMode="cover"
            style={{
              overflow: 'hidden',
              backgroundColor: Theme.other.imageBackground,
              borderRadius: 16,
              display: 'flex',
              flexDirection: 'row',
              marginBottom: 32,
            }}>
            <View
              style={{
                paddingLeft: 16,
                paddingTop: 16,
                paddingBottom: 16,
                width: '50%',
                display: 'flex',
                flexDirection: 'column',
              }}>
              <BoldText style={{fontSize: 28, color: Theme.text.primary}}>
                Store is closed
              </BoldText>
              <BoldText
                manrope={true}
                style={{
                  color: Theme.text.primary,
                  fontSize: 14,
                  lineHeight: 28,
                }}>
                {university.data?.data()?.closedMessage}
              </BoldText>
            </View>
            <View
              style={{
                width: '50%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                style={{
                  // transform: [{ scaleX: -1 }],
                  resizeMode: 'contain',
                  height: 130,
                }}
                source={require('@/assets/img/logo.png')}
              />
            </View>
          </ImageBackground>
        </Gutter>
      )}
    </View>
  );
}
