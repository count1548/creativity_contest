import React from "react";

interface IParentProps{//props타입 선언
    history : {
        push : (name:string) => void
	}
}
const Home = (props:IParentProps) => {
	const now = new Date();
	const [year, month, date, week_of_day] = [
		now.getFullYear(),
		now.getMonth(),
		now.getDate(),
		now.getDay()
	]
	console.log(year, month, date, week_of_day)
	return (
		<div>
			<h1>홈화면 입니다</h1>
		</div>
	);
};

export default Home;