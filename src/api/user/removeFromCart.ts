import firestore from '@react-native-firebase/firestore';

export async function removeFromCart(
  userID: string | undefined,
  productID: string,
) {
  const user = await firestore().collection('users').doc(userID).get();
  const cart = user.data()?.cart || [];
  const itemInCart = cart.find((item: any) => item.product === productID);
  if (!itemInCart) return Promise.reject(new Error('Item not in cart'));
  cart.splice(cart.indexOf(itemInCart), 1);
  return firestore().collection('users').doc(user.id).set(
    {
      cart: cart,
    },
    {merge: true},
  );
}
