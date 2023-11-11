import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getCountFromServer } from 'firebase/firestore';

const Investigations = () => {
  const [documentCount, setDocumentCount] = useState(0);

  useEffect(() => {
    // Your Firebase configuration and initialization code here

    const fetchDocumentCount = async () => {
      try {
        const coll = collection(db, "companies");
        const snapshot = await getCountFromServer(coll);
        const count = snapshot.data().count;
        setDocumentCount(count);
      } catch (error) {
        console.error('Error fetching document count:', error);
      }
    };

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
