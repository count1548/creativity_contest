import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { purple, blue } from "@material-ui/core/colors";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";

const PurpleSwitch = withStyles({
	switchBase: {
		color: purple[300],
		"&$checked": {
			color: purple[500]
		},
		"&$checked + $track": {
			backgroundColor: purple[500]
		}
	},
	checked: {
		color: blue[300],
		"&$checked": {
			color: blue[500]
		},
		"&$checked + $track": {
			backgroundColor: blue[500]
		}
	},
	track: { backgroundColor: purple[500] }
})(Switch);
export default function CustomizedSwitches(props) {
	const [state, setState] = React.useState({
		type: "등교"
	});
	const [checked, setChecked] = React.useState({
		checked: false
	});
	const handleChange = name => event => {
		setState({
			type: state.checked ? "등교" : "하교"
		});
		setChecked({
			[name]: event.target.checked
		});
	};
	return (
		<FormGroup>
			<FormControlLabel
				control={
					<PurpleSwitch
						checked={checked.checked}
						onChange={handleChange("checked")}
						value={state.value}
					/>
				}
				label={state.type}
			/>
		</FormGroup>
	);
}
