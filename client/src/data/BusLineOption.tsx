class createSelector {
	constructor (name, label, options, action, active = null) {	//active 활성조건 action 값 변경시 동작
		[this.name, this.label, this.options, this.action, this.active] = 
			[name, label, options, action, active]
	}
	this.now = defaultVal
	const changeValue = event => this.action(this.now = event.target.value)
	const object = () => 
		<FormControlLabel style={{ width : '30%' }} control={
                <FormControl variant="outlined" className={classes.formControl} 
					{(this.active == null || this.active() == true) ? null : 'disable'}>
                    <InputLabel htmlFor="outlined-age-native-simple">{this.label}</InputLabel>
                    <Select
                        value={now}
                        onChange={changeValue}
                        label={this.label}
                        inputProps={{
                            name: {this.name},
                            id: 'outlined-age-native-simple',
                        }}>
					{this.options.map((data, idx) => <MenuItem value={data['value']}>{data['label']}</MenuItem>)}
                    </Select>
                </FormControl>
		} label="캠퍼스" labelPlacement="start" />
}