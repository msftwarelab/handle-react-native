import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';

/**
 * Gets the products that the user has ordered before
 * @param {string} schoolID - School ID
 * @param {string} uid - User ID
 * @returns {Promise<Record<string, any>>[]} - Promise that resolves to an array of product objects
 */
export async function getOrderAgainItems(
  schoolID: string,
  uid: string | undefined,
): Promise<
  FirebaseFirestoreTypes.DocumentSnapshot<FirebaseFirestoreTypes.DocumentData>[]
> {
  if (!uid) {
    return Promise.reject();
  }
  let ordersQuery = await firestore()
    .collection(`universities/${schoolID}/orders`)
    .where('customerID', '==', uid)
    .orderBy('timestamp', 'desc')
    .get();

  const productIDs: string[] = [];
  ordersQuery.forEach(order => {
    order.data().products.forEach((product: any) => {
      if (productIDs.indexOf(product.id) === -1 && productIDs.length < 24) {
        productIDs.push(product.id);
      }
    });
  });

  if (productIDs.length !== 0) {
    const productData: FirebaseFirestoreTypes.DocumentSnapshot<FirebaseFirestoreTypes.DocumentData>[] =
      [];
    let failedProducts = 0;
    return new Promise(resolve => {
      productIDs.forEach(product => {
        firestore()
          .collection(`universities/${schoolID}/inventory`)
          .doc(product)
          .get()
          .then(doc => {
            if (doc.data()?.image && doc.data()?.quantity > 0) {
              productData.push(doc);
            } else {
              failedProducts++;
            }
            checkIfDone();
          })
          .catch(err => {
            failedProducts++;
            checkIfDone();
          });

        function checkIfDone() {
          if (productData.length + failedProducts === productIDs.length) {
            resolve(productData);
          }
        }
      });
    });
  } else {
    return [];
  }
}
