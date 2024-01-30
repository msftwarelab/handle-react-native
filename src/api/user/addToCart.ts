import {navigationRef} from '@/router';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import {track} from '@/api';

export async function addToCart(
  userID: string | undefined,
  product:
    | FirebaseFirestoreTypes.DocumentSnapshot<FirebaseFirestoreTypes.DocumentData>
    | undefined,
  quantity: number,
  source: string | undefined,
  positionInList: number | undefined,
): Promise<void> {
  // Parameter validation
  if (!userID) return Promise.reject(new Error('User not found'));
  if (!product) return Promise.reject(new Error('Product not found'));

  // Restricted product validation
  const user = await firestore().collection('users').doc(userID).get();
  const tags: FirebaseFirestoreTypes.DocumentSnapshot<FirebaseFirestoreTypes.DocumentData>[] =
    await Promise.all(
      product
        .data()
        ?.tags.map((tag: string) =>
          firestore().doc(`subcategories/${tag}`).get(),
        ),
    );
  const restricted = tags.some(tag => tag.data()?.restricted);
  if (!user.data()?.verified && restricted) {
    navigationRef.navigate('CheckID');
    return Promise.resolve();
  } else if (user.data()?.verified !== 'Verified' && restricted)
    return Promise.reject(new Error('User not verified'));

  if (quantity > 0) {
    track('added product to cart', {
      product: product.id,
      source,
      positionInList,
    });
  }
  // Add to cart
  const cart = user.data()?.cart || [];
  const itemInCart = cart.find((item: any) => item.product === product.id);
  const max = product.data()?.quantity - (itemInCart?.quantity || 0);
  if (quantity > max)
    return Promise.reject(new Error('Not enough product in stock'));
  if (itemInCart && itemInCart.quantity + quantity > 0) {
    itemInCart.quantity += quantity;
  } else if (itemInCart && itemInCart.quantity + quantity <= 0) {
    cart.splice(cart.indexOf(itemInCart), 1);
  } else {
    cart.push({
      product: product.id,
      quantity: quantity,
      obj: product.data(),
    });
  }
  return firestore().collection('users').doc(user.id).set(
    {
      cart: cart,
    },
    {merge: true},
  );
}
