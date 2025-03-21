import { ButtonBase, Card, CardContent, CardMedia, Typography } from "@mui/material";
import React, { useEffect, useState } from 'react';
import { getComponents } from '../auxFunc/api';
import Component from "./Component";
import TopNavigator from "./TopNavigator";

const CreateTN2 = () => {
  const [components, setComponents] = useState([]);
  const [error, setError] = useState(null);
  const [selectedComponent, setSelectedComponent] = useState({});
  const [modalOpen, setModalOpen] = useState(false);

  // UseEffect to fetch components
  useEffect(() => {
    const fetchComponents = async () => {
      try {
        const result = await getComponents();
        setComponents(result.data.components);
      } catch (err) {
        setError("Error while retrieving components: " + err.message);
      }
    };
    fetchComponents();
  }, []);

  const handleClick = (component) => {
    const id = Date.now();
        setSelectedComponent({ id, name: component });
    setModalOpen(true);
  };
  
  const handleClose = () => {
    setSelectedComponent({});
    setModalOpen(false);
  };

  return (
    <div>
      <TopNavigator />
    <div className="flex flex-col items-center p-4">
      
      <h1 className="text-2xl font-bold mb-4">Create New Trial Network</h1>

      <div className="flex w-full">
        {/* Components List to the left */}
        <div className="w-1/2 flex flex-wrap gap-4">
            {components.length > 0 ? (
              components.map((component, index) => (
                <ButtonBase key={index} onClick={() => handleClick(component)} className="focus:outline-none">
                  <Card className="w-24 hover:shadow-md transition-shadow">
                    <CardMedia
                      component="img"
                      height="40"
                      image={`/icons/${component}.png`}
                      alt={component}
                    />
                    <CardContent className="p-1">
                      <Typography variant="caption" color="text.secondary" className="text-center">
                        {component}
                      </Typography>
                    </CardContent>
                  </Card>
                </ButtonBase>
              ))
            ) : (
              <p className="text-gray-500">No components found.</p>
            )}
          </div>

        {/* Modal */}
        <Component open={modalOpen} handleClose={handleClose} component={selectedComponent} />

        {/* Content in the right */}
        <div className="flex flex-col items-center w-1/2 p-4">
          <p className="text-gray-700">Right site</p>
        </div>
      </div>

      {/* Error if something is wrong */}
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
    </div>
  );
};
export default CreateTN2;