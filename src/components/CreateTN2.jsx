import { Box, Button, ButtonBase, Card, CardContent, CardMedia, TextField, Typography } from "@mui/material";
import React, { useCallback, useEffect, useState } from 'react';
import { getComponents } from '../auxFunc/api';
import Component from "./Component";
import TopNavigator from "./TopNavigator";

const CreateTN2 = () => {
  const [components, setComponents] = useState([]);
  const [error, setError] = useState(null);
  const [focusedComponent, setfocusedComponent] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState({});
  const [temporalData, setTemporalData] = useState({});
  const [searchQuery, setSearchQuery] = useState('');

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
  }, [selectedComponent, temporalData]);
  
  const filteredComponents = components.filter(component =>
    component.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleClick = (component, key, defaultValue) => {
    if (defaultValue || key) {
      setTemporalData(defaultValue);
      setfocusedComponent({ id: key, name: component });
      setModalOpen(true);
    } else {
      const id = Date.now();
      setfocusedComponent({ id, name: component });
      setModalOpen(true);
    }
  };
  
  const handleClose = () => {
    setfocusedComponent({});
    setModalOpen(false);
    setTemporalData({});
  };

  const handleSelect = useCallback((id, fieldName, value) => {
    setSelectedComponent((prevForms) => {
        const updatedForm = {
          ...prevForms,
          [id]: {
            ...prevForms[id],
            [fieldName]: value,
          },
        };
        return updatedForm;
     
      });
  }, []);
  

  const handleRemoveId = useCallback((id) => {
    setSelectedComponent((prevForms) => {
      const updatedForm = { ...prevForms };
      delete updatedForm[id];
      return updatedForm;
    });
  }, []);
  
  return (
    <div>
      <TopNavigator />
      <div className="flex flex-col items-center p-4">
        <h1 className="text-2xl font-bold mb-4">Create New Trial Network</h1>
        <div className="flex w-full gap-4">
          {/* Components List to the left */}
          <Box
            sx={{
              width: '30%',
              display: 'flex',
              flexDirection: 'column',
              marginRight: 'auto',
            }}
          >
            {/* TextField */}
            <TextField
              label="Search Components"
              variant="outlined"
              fullWidth
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
  
            {/* Scroll List */}
            <Box
              sx={{
                width: '100%',
                maxHeight: '70vh',
                overflowY: 'auto',
                padding: 2,
                border: '1px solid #ddd',
                borderRadius: 2,
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                gap: 2,
                boxSizing: 'border-box',
              }}
            >
              {filteredComponents.length > 0 ? (
                filteredComponents.map((component, index) => (
                  <ButtonBase key={index} onClick={() => handleClick(component)} className="focus:outline-none">
                    <Card className="w-24 hover:shadow-md transition-shadow gap-4">
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
            </Box>
          </Box>
  
          {/* Modal */}
          <Component open={modalOpen} handleClose={handleClose} component={focusedComponent} onChange={handleSelect} handleRemove={handleRemoveId} defaultValues={temporalData} />
  
          {/* Content in the right */}
          
          <div className="w-1/2 flex flex-col items-center mr-auto"> 
            {selectedComponent && Object.entries(selectedComponent).length > 0 ? (
              <>
                <h2 className="text-xl font-bold mb-4">Selected Components</h2>
                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 4,
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    border: '2px solid black',
                    borderRadius: '8px',
                    padding: 2,
                    height: 'fit-content',
                    margin: '0 auto',
                  }}
                >
                  {Object.entries(selectedComponent).map(([key, component], index) => (
                    <ButtonBase key={index} onClick={() => handleClick(component.type, key, component)}>
                      <Card className="w-24 hover:shadow-md transition-shadow">
                        <CardMedia
                          component="img"
                          height="40"
                          image={`/icons/${component.type}.png`}
                          alt={component.type}
                        />
                        <CardContent className="p-1">
                          <Typography variant="caption" color="text.secondary" className="text-center">
                            {component.type}
                          </Typography>
                        </CardContent>
                      </Card>
                    </ButtonBase>
                  ))}
                </Box>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center">
                <p className="text-gray-500">No selected components yet.</p>
              </div>
            )}
          </div>
        </div>
        
        <Button  variant="contained" style={{ backgroundColor: '#6B21A8', }}>
           Add
        </Button>
      
        {/* Error if something is wrong */}
        {error && <p className="flex flex-col items-center justify-center text-red-500 mt-4">{error}</p>}
      </div>
      
  
    </div>
  );
  
};

export default CreateTN2;