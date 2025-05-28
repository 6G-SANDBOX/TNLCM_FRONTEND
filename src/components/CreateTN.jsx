import {
  Box,
  Button,
  ButtonBase,
  Card,
  CardContent,
  CardMedia,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import yaml from "js-yaml";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  createTrialNetwork,
  getComponents,
  saveTrialNetwork,
  updateTrialNetwork,
} from "../auxFunc/api";
import convertJsonToYaml from "../auxFunc/yamlHandler";
import Component from "./Component";
import TopNavigator from "./TopNavigator";

const CreateTN = (savedValues) => {
  const [components, setComponents] = useState([]);
  const [focusedComponent, setfocusedComponent] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const [selectedComponent, setSelectedComponent] = useState({});
  const [temporalData, setTemporalData] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [modalErrorOpen, setModalErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage]    = useState("");
  const [success, setSuccess] = useState(null);
  const processedSavedValues = useRef(null);
  const [tnName, setTnName] = useState("");
  const location = useLocation();
  const fileValues = location.state?.file; // If we are coming here with a file, get it

  // UseEffect to fetch the components if we are coming with a file
  useEffect(() => {
    if (fileValues) {
      if (
        JSON.stringify(fileValues) ===
        JSON.stringify(processedSavedValues.current)
      ) {
        //If the network data is the same dont re-render again
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const yamlDescriptor = reader.result;
        try {
          processedSavedValues.current = fileValues;
          const parsedData = yaml.load(yamlDescriptor);
          Object.keys(parsedData.trial_network).forEach((key) => {
            const component = parsedData.trial_network[key];
            const updatedInput = {
              ...component.input,
              name: component.name,
            };
            setSelectedComponent((prevForms) => ({
              ...prevForms,
              [`${component.type}-${new Date().getTime()}`]: {
                type: component.type,
                fields: updatedInput,
                added: true,
                dependencies: component.dependencies,
              },
            }));
          });
        } catch (error) {
          const res = error.response?.data?.message || error.message;
          setError("Error while loading the descriptor: " + res);
        }
      };
      reader.readAsText(fileValues);
    }
  }, [fileValues]);

  // UseEffect to fetch the components if we are editing a saved trial network
  useEffect(() => {
    if (savedValues !== null && Object.keys(savedValues).length > 0) {
      if (
        JSON.stringify(savedValues) ===
        JSON.stringify(processedSavedValues.current)
      ) {
        //If the network data is the same dont re-render again
        return;
      }
      try {
        processedSavedValues.current = savedValues;
        if (
          savedValues.savedValues.raw_descriptor.trial_network === undefined ||
          savedValues.savedValues.raw_descriptor.trial_network === null ||
          savedValues.savedValues.raw_descriptor.trial_network.length === 0
        ) {
          return;
        }

        Object.keys(
          savedValues.savedValues.raw_descriptor.trial_network
        ).forEach((key) => {
          const component =
            savedValues.savedValues.raw_descriptor.trial_network[key];
          const updatedInput = {
            ...component.input,
            name: component.name,
          };
          setSelectedComponent((prevForms) => ({
            ...prevForms,
            [`${component.type}-${new Date().getTime()}`]: {
              type: component.type,
              fields: updatedInput,
              added: true,
              dependencies: component.dependencies,
            },
          }));
        });
      } catch (error) {
        const res = error.response?.data?.message || error.message;
        console.error("Error while accessing to the saved network: " + res);
      }
    }
  }, [savedValues]);

  // UseEffect to fetch components
  useEffect(() => {
    const fetchComponents = async () => {
      try {
        const result = await getComponents();
        setComponents(result.data.components);
      } catch (error) {
        // Handle error
        const res = error.response?.data?.message || error.message;
        setError("Error while retrieving components: " + res);
      }
    };
    fetchComponents();
  }, [temporalData, selectedComponent, tnName]);

  // Filter components based on the search query
  const filteredComponents = components.filter((component) =>
    component.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Function to handle the click on a component
  const handleClick = (component, key, defaultValue) => {
    // If the component is already selected, open the modal with the data
    if (defaultValue || key) {
      setTemporalData(defaultValue);
      setfocusedComponent({ id: key, name: component });
      setModalOpen(true);
    } else {
      const restrictedComponents = ["tn_bastion", "tn_vxlan", "tn_init", "tsn"];
      // Check if the component is restricted
      if (restrictedComponents.includes(component)) {
        const componentExists = Object.values(selectedComponent).some(
          (entry) => entry.type === component
        );
        if (componentExists) {
          setModalErrorOpen(true);
          setErrorMessage(`Error: The component ${component} already exists.`);
          return;
        }
        // Special case for tn_init
        if (component === "tn_init") {
          const hasTnInit = Object.values(selectedComponent).some(
            (entry) => entry.type === "tn_init"
          );
          const hasTnVxlan = Object.values(selectedComponent).some(
            (entry) => entry.type === "tn_vxlan"
          );
          const hasTnBastion = Object.values(selectedComponent).some(
            (entry) => entry.type === "tn_bastion"
          );
          if (hasTnInit) {
            setModalErrorOpen(true);
            setErrorMessage(
              "Error: Cannot add tn_init because it already exists."
            );
            return;
          }
          if (hasTnVxlan || hasTnBastion) {
            setModalErrorOpen(true);
            setErrorMessage(
              "Error: Cannot add tn_init because tn_vxlan or tn_bastion already exist."
            );
            return;
          }
        }
        // Special case for tn_vxlan
        if (component === "tn_vxlan") {
          const hasTnVxlan = Object.values(selectedComponent).some(
            (entry) => entry.type === "tn_vxlan"
          );
          const hasTnInit = Object.values(selectedComponent).some(
            (entry) => entry.type === "tn_init"
          );
          if (hasTnVxlan || hasTnInit) {
            setModalErrorOpen(true);
            setErrorMessage(
              "Error: Cannot add more tn_vxlan, already one or a tn_init exist."
            );
            return;
          }
        }
        //Special case for tn_bastion
        if (component === "tn_bastion") {
          const hasTnBastion = Object.values(selectedComponent).some(
            (entry) => entry.type === "tn_bastion"
          );
          const hasTnInit = Object.values(selectedComponent).some(
            (entry) => entry.type === "tn_init"
          );
          if (hasTnBastion || hasTnInit) {
            setModalErrorOpen(true);
            setErrorMessage(
              "Error: Cannot add more tn_bastion, already one or a tn_init exist."
            );
            return;
          }
        }
        // TSN only allows one
        if (
          component === "tsn" &&
          Object.values(selectedComponent).some((entry) => entry.type === "tsn")
        ) {
          setModalErrorOpen(true);
          setErrorMessage("Error: Cannot add more than one tsn.");
          return;
        }
      }
      // Otherwise, add the component
      const id = Date.now();
      setfocusedComponent({ id, name: component });
      setModalOpen(true);
    }
  };

  // Handle the error modal
  const handleCloseErrorModal = () => {
    setModalErrorOpen(false);
    setErrorMessage("");
  };

  // Handle the name of the trial network
  const handleName = (e) => {
    setTnName(e.target.value);
  };

  // Close the component modal
  const handleClose = () => {
    setfocusedComponent({});
    setModalOpen(false);
    setTemporalData({});
  };

  // Callback to handle the selection of a component (Function sent to the modal)
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

  // Callback to remove a component from the selected components (Function sent to the modal)
  const handleRemoveId = useCallback((id) => {
    setSelectedComponent((prevForms) => {
      const updatedForm = { ...prevForms };
      delete updatedForm[id];
      return updatedForm;
    });
    setfocusedComponent({});
    setTemporalData({});
  }, []);

  // Handle the save of the trial network
  const handleSave = () => {
    // Execute the petition to the server
    (async () => {
      try {
        const tnInit = Object.values(selectedComponent).some(
          (component) => component.type === "tn_init"
        );
        const yamlString = convertJsonToYaml(selectedComponent, tnInit);
        let formDataS = new FormData();
        const blobV = new Blob([yamlString], { type: "text/yaml" });
        if (tnName.trim() !== "" && tnName !== null && tnName !== undefined) {
          formDataS.append("tn_id", tnName);
        }
        formDataS.append("descriptor", blobV, "descriptor.yaml");
        formDataS.append(
          "library_reference_type",
          process.env.REACT_APP_LIBRARY_REF
        );
        formDataS.append(
          "library_reference_value",
          process.env.REACT_APP_LIBRARY_REF_VALUE
        );
        if (savedValues !== null && Object.keys(savedValues).length > 0) {
          await updateTrialNetwork(
            formDataS,
            savedValues.savedValues.trialNetworkId
          );
        } else {
          await saveTrialNetwork(formDataS);
        }
        setSuccess("Trial Network saved successfully!");
        setTimeout(() => {
          window.location = "/dashboard";
          setSuccess("");
        }, 2502);
      } catch (error) {
        const res = error.response?.data?.message || error.message;
        setSuccess("");
        setModalErrorOpen(true);
        setErrorMessage("Error: Can not save the TN due to: " + res);
      }
    })();
  };

  // Handle if the fields of the selected components are eno longer available
  const handleDependencies = () => {
    let bool = false;
    for (const [key, component] of Object.entries(selectedComponent)) {
      for (const dependency of component.dependencies) {
        const splited = dependency.split("-");
        if (splited.length > 1) {
          bool = Object.values(selectedComponent).some(
            (entry) =>
              entry.type === splited[0] && entry.fields.name === splited[1]
          );
        } else if (splited.length === 1) {
          bool = Object.values(selectedComponent).some(
            (entry) => entry.type === splited[0]
          );
        }
        if (!bool) {
          selectedComponent[key].dependencies = selectedComponent[
            key
          ].dependencies.filter((dep) => dep !== dependency);
        }
      }
    }
  };

  // Handle the validation of the trial network
  const handleValidate = () => {
    // Execute the petition to the server
    (async () => {
      try {
        handleDependencies();
        const tnInit = Object.values(selectedComponent).some(
          (component) => component.type === "tn_init"
        );
        const yamlString = convertJsonToYaml(selectedComponent, tnInit);
        console.log("YAML String: ", yamlString);
        // TODO ERROR WITH NOKIA AND OPEN5GS
        let formDataV = new FormData();
        const blobV = new Blob([yamlString], { type: "text/yaml" });
        if (tnName.trim() !== "" && tnName !== null && tnName !== undefined) {
          formDataV.append("tn_id", tnName);
        }
        formDataV.append("descriptor", blobV, "descriptor.yaml");
        formDataV.append(
          "library_reference_type",
          String(process.env.REACT_APP_LIBRARY_REF)
        );
        formDataV.append(
          "library_reference_value",
          String(process.env.REACT_APP_LIBRARY_REF_VALUE)
        );
        formDataV.append(
          "sites_branch",
          String(process.env.REACT_APP_SITES_BRANCH)
        );
        formDataV.append(
          "deployment_site",
          String(process.env.REACT_APP_DEPLOYMENT_SITE)
        );
        formDataV.append(
          "deployment_site_token",
          String(process.env.REACT_APP_DEPLOYMENT_SITE_TOKEN)
        );
        await createTrialNetwork(formDataV);
        setSuccess("Trial Network validated successfully!");
        setTimeout(() => {
          window.location = "/dashboard";
          setSuccess("");
        }, 2502);
      } catch (error) {
        const res = error.response?.data?.message || error.message;
        setSuccess("");
        setModalErrorOpen(true);
        setErrorMessage("Error: Can not save the TN due to: " + res);
      }
    })();
  };

  // Filter and format the selected components to send the data to the modal
  function filterAndFormatEntries(typesList) {
    const res = Object.entries(selectedComponent)
      .filter(([_, value]) => {
        // If we are searching for tn_vxlan, allow tn_init becouse
        if (typesList.includes("tn_vxlan") && value.type === "tn_init") {
          return value;
        }
        // For all other cases, just return it
        return typesList.includes(value.type);
      })
      .map(([_, value]) => {
        // If the component has a name, return it with the type, otherwise just return the type
        return value.fields?.name
          ? `${value.type}-${value.fields.name}`
          : value.type;
      });
    return res;
  }

  return (
    <div>
      <TopNavigator />
      <div className="flex flex-col items-center p-4">
        <h1 className="text-2xl font-bold mb-4">Create New Trial Network</h1>
        <TextField
          variant="outlined"
          value={tnName || ""}
          label="Trial Network Name"
          placeholder="Optional"
          onChange={handleName}
          type="string"
          className="mb-2"
        />
        <div className="flex w-full gap-4">
          {/* Components List to the left */}
          <Box
            sx={{
              width: "30%",
              display: "flex",
              flexDirection: "column",
              marginRight: "auto",
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
                width: "100%",
                maxHeight: "70vh",
                overflowY: "auto",
                padding: 2,
                border: "1px solid #ddd",
                borderRadius: 2,
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                gap: 2,
                boxSizing: "border-box",
              }}
            >
              {filteredComponents.length > 0 ? (
                filteredComponents.map((component, index) => (
                  <ButtonBase
                    key={index}
                    onClick={() => handleClick(component)}
                    className="focus:outline-none"
                  >
                    <Card className="w-24 hover:shadow-md transition-shadow gap-4">
                      <CardMedia
                        component="img"
                        height="40"
                        image={`/icons/${component}.png`}
                        alt={component}
                      />
                      <CardContent className="p-1">
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          className="text-center"
                        >
                          {component}
                        </Typography>
                      </CardContent>
                    </Card>
                  </ButtonBase>
                ))
              ) : (
                <img
                  src="/loading.gif"
                  alt="Loading..."
                  style={{ width: "50px" }}
                />
              )}
            </Box>
          </Box>

          {/* Component Modal */}
          <Component
            open={modalOpen}
            handleClose={handleClose}
            component={focusedComponent}
            onChange={handleSelect}
            handleRemove={handleRemoveId}
            defaultValues={temporalData}
            filter={filterAndFormatEntries}
          />

          {/* Modal Error when opening existant components */}
          <Modal
            open={modalErrorOpen}
            onClose={handleCloseErrorModal}
            className="flex items-center justify-center"
          >
            <Box
              sx={{
                width: "400px",
                maxWidth: "90%",
                padding: "20px",
                backgroundColor: "white",
                borderRadius: 4,
                boxShadow: 24,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <Typography variant="h6" color="error">
                {errorMessage}
              </Typography>
              <Button
                onClick={handleCloseErrorModal}
                variant="contained"
                color="primary"
                sx={{ marginTop: 2 }}
              >
                Close
              </Button>
            </Box>
          </Modal>

          {/* Content in the right */}
          <div className="w-1/2 flex flex-col items-center mr-auto">
            {selectedComponent &&
            Object.entries(selectedComponent).length > 0 ? (
              <>
                <h2 className="text-xl font-bold mb-4">Selected Components</h2>
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 4,
                    justifyContent: "center",
                    alignItems: "flex-start",
                    border: "2px solid black",
                    borderRadius: "8px",
                    padding: 2,
                    height: "fit-content",
                    margin: "0 auto",
                  }}
                >
                  {Object.entries(selectedComponent).map(
                    ([key, component], index) => (
                      <ButtonBase
                        key={index}
                        onClick={() =>
                          handleClick(component.type, key, component)
                        }
                      >
                        <Card className="w-24 hover:shadow-md transition-shadow">
                          <CardMedia
                            component="img"
                            height="40"
                            image={`/icons/${component.type}.png`}
                            alt={component.type}
                          />
                          <CardContent className="p-1">
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              className="text-center"
                            >
                              {component.type}
                            </Typography>
                          </CardContent>
                        </Card>
                      </ButtonBase>
                    )
                  )}
                </Box>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center">
                <p className="text-gray-500">No selected components yet.</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-4 mt-4">
          {/* Validate Button */}
          <Button
            onClick={handleValidate}
            variant="contained"
            style={{ backgroundColor: "#6B21A8" }}
          >
            Validate
          </Button>

          {/* Save Button */}
          <Button
            onClick={handleSave}
            variant="contained"
            style={{ backgroundColor: "#6B21A8" }}
          >
            Save
          </Button>
        </div>

        {/* Error if something is wrong */}
        {error && (
          <p className="flex flex-col items-center justify-center text-red-500 mt-4">
            {error}
          </p>
        )}
        {/* Success message if everything is fine */}
        {success && (
          <p className="flex flex-col items-center justify-center text-green-500 mt-4">
            {success}
          </p>
        )}
      </div>
    </div>
  );
};

export default CreateTN;
