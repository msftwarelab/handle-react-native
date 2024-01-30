import {
  View,
  Pressable,
  TouchableOpacity,
  Modal,
  Dimensions,
} from 'react-native';
import {useEffect, useState} from 'react';
import Subheader from './Subheader';
import {BoldText, RegularText} from '@/components';
import {Theme} from '@/constants';

export default function Tip({
  tip,
  setTip,
}: {
  tip: number;
  setTip: (tip: number) => void;
}) {
  const [showZeroTipModal, setShowZeroTipModal] = useState(false);
  useEffect(() => {
    if (tip === 0) {
      setShowZeroTipModal(true);
    }
  }, [tip]);

  return (
    <View style={{marginTop: 40}}>
      <ZeroTipModal show={showZeroTipModal} setShow={setShowZeroTipModal} />
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Subheader>Tip</Subheader>
        <TipExplainer />
      </View>
      <View
        style={{
          width: '100%',
          borderRadius: 1000,
          padding: 4,
          borderWidth: 1,
          borderColor: Theme.separator.gray,
          display: 'flex',
          flexDirection: 'row',
          marginTop: 12,
        }}>
        <TipOption value={0} />
        <TipDivider value={0.5} />
        <TipOption value={1} />
        <TipDivider value={1.5} />
        <TipOption value={2} />
        <TipDivider value={2.5} />
        <TipOption value={3} />
        <TipDivider value={3.5} />
        <TipOption value={4} />
      </View>
    </View>
  );

  function TipDivider({value}: {value: number}) {
    if (tip === value - 0.5 || tip === value + 0.5) {
      return <></>;
    } else {
      return (
        <View
          style={{
            height: '100%',
            width: 1,
            backgroundColor: Theme.separator.gray,
          }}
        />
      );
    }
  }

  function TipOption({value}: {value: number}) {
    const selected = value === tip;

    return (
      <Pressable
        onPress={() => {
          setTip(value);
        }}
        style={[
          {
            flex: 1,
            borderRadius: 100,
            justifyContent: 'center',
            alignItems: 'center',
          },
          selected ? {backgroundColor: Theme.common.offWhite} : {},
        ]}>
        <BoldText style={{color: Theme.text.primary, padding: 14}}>
          ${value}
        </BoldText>
      </Pressable>
    );
  }
}

function ZeroTipModal({
  show,
  setShow,
}: {
  show: boolean;
  setShow: (show: boolean) => void;
}) {
  return (
    <Modal visible={show} animationType="fade" transparent>
      <Pressable
        onPress={() => {
          setShow(false);
        }}
        style={{
          backgroundColor: Theme.main.primary + '66',
          height: '100%',
          width: '100%',
        }}
      />
      <View
        style={{
          position: 'absolute',
          height: 240,
          width: Dimensions.get('screen').width - 40,
          left: 20,
          top: Dimensions.get('screen').height / 2 - 210 / 2,
          backgroundColor: 'white',
          borderRadius: 20,
        }}>
        <BoldText
          style={{
            color: Theme.text.primary,
            fontSize: 26,
            width: '100%',
            textAlign: 'center',
            marginTop: 32,
            marginBottom: 16,
          }}>
          Tips on {Theme.name}
        </BoldText>
        <RegularText
          style={{
            paddingHorizontal: 20,
            textAlign: 'center',
            color: Theme.text.primary,
          }}>
          100% of tips are given to our student Handlers and Packers who use
          their earnings to pay student loans and cover living expenses.{'\n\n'}
          Tipping is never expected, and always appreciated.
        </RegularText>
      </View>
    </Modal>
  );
}

function TipExplainer() {
  const [show, setShow] = useState(false);
  return (
    <>
      <TouchableOpacity
        onPress={() => {
          setShow(true);
        }}>
        <RegularText
          style={{
            fontSize: 12,
            color: Theme.common.gray,
            textDecorationLine: 'underline',
          }}>
          Where does my tip go?
        </RegularText>
      </TouchableOpacity>
      <Modal visible={show} animationType="fade" transparent>
        <Pressable
          onPress={() => {
            setShow(false);
          }}
          style={{
            backgroundColor: Theme.main.primary + '66',
            height: '100%',
            width: '100%',
          }}
        />
        <View
          style={{
            position: 'absolute',
            height: 210,
            width: Dimensions.get('screen').width - 40,
            left: 20,
            top: Dimensions.get('screen').height / 2 - 210 / 2,
            backgroundColor: 'white',
            borderRadius: 20,
          }}>
          <BoldText
            style={{
              color: Theme.text.primary,
              fontSize: 26,
              width: '100%',
              textAlign: 'center',
              marginTop: 32,
              marginBottom: 16,
            }}>
            Tips on {Theme.name}
          </BoldText>
          <RegularText
            style={{
              paddingHorizontal: 20,
              textAlign: 'center',
              color: Theme.text.primary,
            }}>
            {Theme.name} tips are pooled and distributed to the Handlers and Packers
            responsible for getting your order to your door super fast. 100% of
            tips are distributed to our student Packers and Handlers.
          </RegularText>
        </View>
      </Modal>
    </>
  );
}
