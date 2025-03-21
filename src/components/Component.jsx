import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { getComponent } from "../auxFunc/api";

const Component = ({ open, handleClose, component }) => {
  const [data, setData] = useState([]);
	const [fieldValues, setFieldValues] = useState({});

	useEffect(() => {
		const fetchData = async () => {
			const result = await getComponent(component.name);
			setData(result.component_input);
		};
		if (open) fetchData();
	}, [component, open]);

	const handleSendClose = () => {
		setData([]);
		handleClose();
	}

	const handleChange = (key) => (event) => {
    setFieldValues({
      ...fieldValues,
      [key]: event.target.value,
    });
  }

  return (
    <Modal open={open} onClose={handleSendClose} aria-labelledby="component-modal">
      <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-2/3 text-center">
				<Typography gutterBottom variant="h6" className="mb-2">
					{String(component.name).toUpperCase()}
				</Typography>

				{data && typeof data === "object" ? (
					Object.entries(data).map(([key, value]) => (
						<div key={key} className=" text-left mb-4 ">
							<Typography gutterBottom variant="body2" color="text.secondary" className="mb-1">
								<strong>{key}:</strong>
							</Typography>
							<TextField
								variant="outlined"
								fullWidth
								label={key}
								placeholder={String(value.default_value)}
								onChange={handleChange(key)}
								type={value.type === "str" ? "text" : "text"}
								className="mb-2"
							/>
							<Typography variant="body2" color="text.secondary" className="text-sm">
								{value.description}
							</Typography>
						</div>
					))
				) : (
					<Typography variant="body2" color="text.secondary">
						{String(data)}
					</Typography>
				)}

				<Button onClick={handleSendClose} variant="contained" color="primary" className="mt-4">
					Close
				</Button>
			</Box>
    </Modal>
  );
};

export default Component;
