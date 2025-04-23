import { Box, Button, Checkbox, FormControl, FormControlLabel, FormGroup, InputLabel, MenuItem, Modal, Select, TextField, Typography } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { getComponent } from "../auxFunc/api";

const Component = ({ open, handleClose, component, onChange, handleRemove, defaultValues, filter }) => {
    const [data, setData] = useState(null);
	const [fieldValues, setFieldValues] = useState({});
	const [details, setDetails] = useState(false);
	const [version, setVersion] = useState(false);
	const [dependencies, setDependencies] = useState([]);
	const [name, setName] = useState("");
	const [error, setError] = useState(false);
	const exceptions = ["tn_init", "tsn", "tn_bastion", "tn_vxlan"];

	// Close the modal and reset the data
	const handleSendClose = useCallback(() => {
		setData(null);
		setName("");
		setError(false);
		setFieldValues({});
		handleClose();
		setDetails(false);
		setVersion(false);
		setDependencies([]);
	}, [handleClose]);

	// UseEffect to fetch the data when the modal is open
	useEffect(() => {
		const fetchData = async () => {
				const result = await getComponent(component.name);
				setData(result);
				if (!result) {
					setError(true);
				}
				setName(component.name);
		};
		// If the modal is open, fetch the data
		if (open) fetchData();
		// If we come with default values, set them
		if (defaultValues.added) {
			setVersion(true);
			setFieldValues(defaultValues.fields);
		};
	}, [component, open, onChange, defaultValues, handleSendClose]);

	// UseEffect to delete the fields that are no longer available
	useEffect(() => {
		if (!data) return;
		for(const [key, value] of Object.entries(data?.component?.input)) {
			if (value.type.match(/^list\[(.+)\]$/)){
				for (const field of fieldValues[key]) {
					if (filter(parseTypeString(value.type)).includes(field)) {
						setFieldValues((prevState) => {
							const updatedValues = { ...prevState };
							updatedValues[key] = updatedValues[key]?.filter(val => val !== field);
							return updatedValues;
						});
					}
				}
			} else if (value.type.includes(" or ")) {
				const parsedOptions = parseOrSeparatedString(value.type);
				if (parsedOptions.includes(fieldValues[key])) {
					setFieldValues((prevState) => {
						const updatedValues = { ...prevState };
						updatedValues[key] = updatedValues[key]?.filter(val => val !== fieldValues[key]);
						return updatedValues;
					});
				}
			}
		}
	},[data, fieldValues, filter]);

	// Remove the component from the list
	const handleSendRemove = () => {
		handleRemove(component.id);
		handleSendClose();
	}

	// Handle the change of the input fields
	const handleChange = (key) => (event) => {
		setFieldValues({
		...fieldValues,
		[key]: event.target.value,
		});
  	}

	// Handle the select input fields
	const handleSelect = (key) => (event) => {
		setFieldValues({
		...fieldValues,
		[key]: event.target.value,
		});
		setDependencies((prevState) => {
			const updatedDependencies = [...prevState];
			if (event.target.value) {
				updatedDependencies.push(event.target.value);
			}
			else {
				updatedDependencies.pop(event.target.value);
			}
			return updatedDependencies;
		});

  	}

	// Add/Save the component to the list
	const handleAdd = () => {
		if (!exceptions.includes(component.name) && !fieldValues["name"]) {
			return;
		}
		if(handleValidate()) {
			return;
		}
		onChange(component.id, "fields", fieldValues);
		onChange(component.id, "type", component.name);
		onChange(component.id, "added", "true");
		onChange(component.id, "dependencies", dependencies);
		handleSendClose();
	}

	const handleValidate = () => {
		let isNotValid = false;
		if (data.component?.input && typeof data.component.input === "object") {
			Object.entries(data.component.input).forEach(([key, value]) => {
				if (value.required_when && !fieldValues[key]) {
					isNotValid = true;
				}
			});
		}
		return isNotValid;
	  };

	// Show/Hide the details of the component
	const handleDetails = () => {
		setDetails(!details);
	}

	// Handle the checkbox input fields
	const handleCheckbox = (event, key) => {
        const { name, checked } = event.target;
        setFieldValues((prevState) => {
            const updatedValues = { ...prevState };
            if (checked) {
                if (updatedValues[key]) {
                    updatedValues[key] = [...updatedValues[key], name];
                } else {
                    updatedValues[key] = [name];
                }
            } else {
                updatedValues[key] = updatedValues[key]?.filter(val => val !== name);
            }
            return updatedValues;
        });
		setDependencies((prevState) => {
			const updatedDependencies = [...prevState];
			if (checked) {
				updatedDependencies.push(name);
			}
			else {
				updatedDependencies.pop(name);
			}
			return updatedDependencies;
		});
    };

	// HTML Content
  if (data) return (
    <Modal sx={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
			}} open={open} onClose={handleSendClose} aria-labelledby="component-modal">
		<Box sx={{
			width: '500px',
			maxWidth: '90%',
			maxHeight: '90vh',
			overflowY: 'auto',
			paddingBottom: '16px',
			backgroundColor: 'white',
			borderRadius: 4,
			boxShadow: 24,
			padding: '20px',
			border: '2px solid black',
		}}>
			{/* Title */}
			<Typography gutterBottom variant="h4" className=" text-center mb-2">
				{name.toUpperCase()}
			</Typography>
			{/* Description or Loader*/}
			{!data.component?.metadata?.long_description ? (
			<div className=" justify-center flex">
				<img src="/loading.gif" alt="Loading..." style={{ width: '50px' }}/>
			</div>
			) : (
			<Typography gutterBottom variant="body1" className="text-center mb-2">
				{String(data.component?.metadata?.long_description)}
			</Typography>
			)}
			{/* Details */}
			{details && data && typeof data === "object" ? (
				<>
					{/* Name Field */}
					{!exceptions.includes(component.name) && (
						<TextField
							variant="outlined"
							fullWidth
							value={fieldValues["name"] || ""}
							label={"Name"}
							onChange={handleChange("name")}
							type="text"
							className="mb-2"
							error={!fieldValues["name"]}
						/>
					)}
					{data.component?.input && typeof data.component.input === "object" ? (
						Object.entries(data.component.input).map(([key, value]) => (
							<div key={key} className="text-left mb-4">
								<Typography variant="body1" color="text.secondary" className="text-sm" sx={{ padding: '6px' }}>
									{value.description}
								</Typography>
								{value.type === "str" ? (
									value.choices ? (
										// Choice Field
										<FormControl fullWidth>
											<InputLabel id={`${key}-label`}>{key}</InputLabel>
											<Select
												labelId={`${key}-label`}
												id="select"
												value={fieldValues[key] || ""}
												onChange={handleChange(key)}
												label={key}
												error={(!fieldValues[key] && value.required_when)}
											>
											{value.choices.map((choice, index) => (
											<MenuItem key={index} value={choice}>
												{choice}
											</MenuItem>
											))}
											</Select>
										</FormControl>
									) : (
										// Text Field
									<TextField
										variant="outlined"
										fullWidth
										value={fieldValues[key] || ""}
										label={key}
										placeholder={String(value.default_value)}
										onChange={handleChange(key)}
										type="text"
										className="mb-2"
										error={(!fieldValues[key] && value.required_when)}
									/>)
								) : value.type === "int" ? (
									// Number Field
									<TextField
										variant="outlined"
										fullWidth
										value={fieldValues[key] || ""}
										label={key}
										placeholder={String(value.default_value)}
										onChange={handleChange(key)}
										type="number"
										className="mb-2"
										error={(!fieldValues[key] && value.required_when)}
									/>
								) : value.type === "bool" ? (
									// Boolean Field
									<FormControl fullWidth>
										<InputLabel id={`${key}-label`}>{key}</InputLabel>
										<Select
											labelId={`${key}-label`}
											label={key}
											value={fieldValues[key] || ""}
											onChange={handleChange(key)}
											error={(!fieldValues[key] && value.required_when)}
										>
											<MenuItem value="true">True</MenuItem>
											<MenuItem value="false">False</MenuItem>
										</Select>
									</FormControl>
								) : value.type.match(/^list\[(.+)\]$/) ? (
									// Checkbox Field
									<FormGroup sx={{ border: (!fieldValues[key] && value.required_when) ? '1px solid red' : 'none', p: 1, borderRadius: 1 }}>
									<InputLabel sx={{ fontWeight: 700 }}>{key}: </InputLabel>
									{filter(parseTypeString(value.type)).length > 0 ? (
										filter(parseTypeString(value.type)).map((option) => (
										<FormControlLabel
											key={option}
											control={
											<Checkbox
												checked={fieldValues[key]?.includes(option) || false}
												onChange={(e) => handleCheckbox(e, key)}
												name={option}
												error={(!fieldValues[key] && value.required_when)}
											/>
											}
											label={option}
										/>
										))
									) : (
										<Typography variant="body2" color="textSecondary">
										Create new components for being able to see them here
										</Typography>
									)}
									</FormGroup>
								) : value.type.includes(" or ") ? (
									// Select Field
									<FormControl fullWidth>
									<InputLabel sx={{ fontWeight: 700 }}>{key}</InputLabel>
									<Select value={fieldValues[key] || ""} onChange={handleSelect(key)} label={key} error={(!fieldValues[key] && value.required_when)}>
										{filter(parseOrSeparatedString(value.type)).map((option) => (
										<MenuItem key={option} value={option}>
											{option}
										</MenuItem>
										))}
									</Select>
									</FormControl>
								) : "" }
							</div>
						))
					) : null}
				</>
			) : null}
			{/* TODO Errores de cuando le das al boton de add y no pasa nada porque hay campos sin rellenar */}
			{/* Buttons */}
			<Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 2 }}>
				<Button onClick={handleSendClose} variant="contained" color="primary">
					Close
				</Button>
				{version ?
					<Button onClick={handleSendRemove} variant="contained" color="primary">
						Remove
					</Button> : ""
				}
				<Button onClick={handleDetails} variant="contained" color="primary">
					{details ? "Hide" : "Show"} Details
				</Button>

				<Button onClick={handleAdd} variant="contained" color="primary">
					{version ? "Save" : "Add"}
				</Button>
			</Box>
		</Box>
    </Modal>
  );

  if (!data) return (
	<Modal sx={{
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	}} open={open} onClose={handleSendClose} aria-labelledby="component-modal">
		<Box sx={{
			width: '500px',
			maxWidth: '90%',
			maxHeight: '90vh',
			overflowY: 'auto',
			paddingBottom: '16px',
			backgroundColor: 'white',
			borderRadius: 4,
			boxShadow: 24,
			padding: '20px',
			border: '2px solid black',
		}}>
			{/* Title */}
			<Typography gutterBottom variant="h4" className=" text-center mb-2">
				{name.toUpperCase()}
			</Typography>
			{/* Description*/}
			{!error ? (
				<div className=" justify-center flex">
					<img src="/loading.gif" alt="Loading..." style={{ width: '50px' }}/>
				</div>
				) : (
				<Typography variant="body1" color="text.secondary" className="text-center mb-2">
					Component not available in the current library
				</Typography>
			)}
			{/* Close Button */}
			<Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 2 }}>
				<Button onClick={handleSendClose} variant="contained" color="primary">
					Close
				</Button>
			</Box>
		</Box>
    </Modal>
  );
};

function parseTypeString(typeStr) {
    // Check if the format is "list[...]"
    const match = typeStr.match(/^list\[(.+)\]$/);
    if (!match) return []; // Return an empty array if the format is not correct
    // Extract the content inside the brackets
    const content = match[1];
	// Split the content by "or" and trim the results
	const res = content.split(" or ").map(type => type.trim())
    return res;
}

function parseOrSeparatedString(typeStr) {
    // Split the type string by " or " and trim
    return typeStr.includes(" or ") ? typeStr.split(" or ").map(type => type.trim()) : [typeStr.trim()];
}
export default Component;
