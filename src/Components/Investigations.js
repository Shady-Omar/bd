import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getCountFromServer, getDocs } from 'firebase/firestore';

const Investigations = () => {
  const [documentCount, setDocumentCount] = useState(0);

  useEffect(() => {
    // Your Firebase configuration and initialization code here

    const fetchDocumentCount = async () => {
      try {
        // const coll = collection(db, "search-count");
        // const snapshot = await getCountFromServer(coll);
        // const count = snapshot.data().count;
        // setDocumentCount(count);
        
        const querySnapshot = await getDocs(collection(db, 'search-count'));
        querySnapshot.forEach((doc) => {
          // Assuming 'your_field_name' is the field you want to retrieve
          const CountValue = doc.data().count;
          setDocumentCount(CountValue);
        });
      } catch (error) {
        console.error('Error fetching data from Firestore: ', error);
      }

    };

    // console.log(documentCount);
    fetchDocumentCount();
  }, []); // Empty dependency array to run the effect only once on component mount

  return (

    <div id="requestCountersDiv" className="flex justify-center items-center flex-col my-12">
      <p className="mb-0 text-[1.5rem] md:text-[1.75rem] font-bold"> Searches so far: </p>
      <p className="mb-0 text-[1.5rem] md:text-[2rem] font-bold" id="requestCounters">{documentCount}</p>
    </div>
  );
};

export default Investigations;
