import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getTrialNetwork } from '../auxFunc/api';
import TopNavigator from './TopNavigator';

function Network() {
  const { id } = useParams();  // We get the `id` parameter from the URL
  const [data, setData] = useState(null);
  const [descriptor, setDescriptor] = useState(null);

  useEffect(() => {
    
    const getData = async () => {
        try {
            const response = await getTrialNetwork(id);
            setData(response.data);
            setDescriptor(response.data.input);
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    };
    getData();
  
  }, [id]);

  //TODO: Add the rest of the code here

  return (
      <div>
      {data === null ? (
      //  If it is null, show a loading gif
      <div className="flex justify-center items-center h-full">
        <img src="loading.gif" alt="Loading..." />
      </div>
    ) : data.state === "created" ? (
      // If the state is "created", let edit the content
      <div>
        <p>El estado es "created". Muestra el contenido específico aquí.</p>
      </div>
    ) : (
      // If it not "created", show the content
      <div>
        <TopNavigator />
      </div>
    )}
    </div>
  );
  
}

export default Network;
