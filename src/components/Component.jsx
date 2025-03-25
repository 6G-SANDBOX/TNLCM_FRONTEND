import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { getComponent } from "../auxFunc/api";

const Component = ({ open, handleClose, component, onChange, handleRemove, defaultValues }) => {
    const [data, setData] = useState([]);
	const [fieldValues, setFieldValues] = useState({});
	const [details, setDetails] = useState(false);
	const [version, setVersion] = useState(false);

	useEffect(() => {
		const fetchData = async () => {
			const result = await getComponent(component.name);
			setData(result);
		};
		if (open) fetchData();
		if (defaultValues.added) {
			setVersion(true);
			setFieldValues(defaultValues.fields);
		};
	}, [component, open, onChange, defaultValues]);

	const handleSendClose = () => {
		setData([]);
		setFieldValues({});
		handleClose();
		setDetails(false);
		setVersion(false);
	}

	const handleSendRemove = () => {
		handleRemove(component.id);
		handleSendClose();
	}

	const handleChange = (key) => (event) => {
		setFieldValues({
		...fieldValues,
		[key]: event.target.value,
		});
  	}

	const handleAdd = () => {
		onChange(component.id, "fields", fieldValues);
		onChange(component.id, "type", component.name);
		onChange(component.id, "added", "true");
		handleSendClose();
	}

	const handleDetails = () => {
		setDetails(!details);
	}

  return (
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
			<Typography gutterBottom variant="h4" className=" text-center mb-2">
				{String(component.name).toUpperCase()}
			</Typography>
			{!data.component?.metadata?.long_description ? (
			<div className=" justify-center flex">
				<img src="/loading.gif" alt="Loading..." style={{ width: '50px' }}/>
			</div>
			) : (
			<Typography gutterBottom variant="body1" className="text-center mb-2">
				{String(data.component?.metadata?.long_description)}
			</Typography>
			)}


			
			{details && data && typeof data === "object" ? (
				Object.entries(data.component?.input || []).map(([key, value]) => (
					<div key={key} className="text-left mb-4 ">
						<Typography variant="body2" color="text.secondary" className="text-sm" sx = {{padding: '6px'}} >
							{value.description}
						</Typography>
						<TextField
							variant="outlined"
							fullWidth
							value={fieldValues[key] || ""}
							label={key}
							placeholder={String(value.default_value)}
							onChange={handleChange(key)}
							type={value.type === "str" ? "text" : "text"}
							className="mb-2"
						/>
						
					</div>
				))
			) : ""}
		
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

				{version ?
					<Button onClick={handleAdd} variant="contained" color="primary">
					Save
					</Button>
				:	<Button onClick={handleAdd} variant="contained" color="primary">
					Add
					</Button>

				}
				
			</Box>

		</Box>
    </Modal>
  );
};

export default Component;
