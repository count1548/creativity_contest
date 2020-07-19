import React from "react";
import SwitchButton from "../component/Switch/Switch";

interface IParentProps{//props타입 선언
    history : {
        push : (name:string) => void
	}
}
const Home = (props:IParentProps) => {
	return (
		<div>
			<h1>홈화면 입니다</h1>
			<SwitchButton /> {/* 등/하교 스위치버튼 */}
		</div>
	);
};

export default Home;