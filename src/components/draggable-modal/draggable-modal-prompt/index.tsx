import DraggableModal from "../index";
import React from "react";
import {Button} from "antd";

interface IProps {
	title?: string;
	wrapClassName?: string;
	show: boolean;
	children: React.ReactNode;
	onOk: (e) => void;
	onCancel: (e) => void;
	hint?: string;
}

export default function DraggableModalPrompt(props:IProps) {
	// state
	const {title='提示', wrapClassName='experiment-delete', show, children, onOk, onCancel,hint=null} = props;
	// render
	return (
		<DraggableModal title={title}
		                wrapClassName={wrapClassName}
		                show={show}
		                onCancel={onCancel}>
			<div className={`${!hint?'mt-11':'mt-8'} w-full flex flex-col items-center`}>
				{children}
				{
					hint &&
					<div className={"mt-2 text-xs text-black-light leading-[18px]"}
							 style={{
						     maxWidth: '80%',
						     textAlign: 'center', // 居中对齐
						     display: 'flex',
						     flexDirection: 'column',
						     alignItems: 'center', // 在交叉轴上居中对齐
					     }}
					>
						{hint}
					</div>
				}
			</div>
			<div className={`${!hint?'mt-12':'mt-[17px]'} pb-6 w-full flex justify-center items-center`}>
				<Button onClick={onCancel} style={{width:'61px',height:'32px'}}>取消</Button>
				<Button className={"ml-4"}
				        onClick={onOk}
				        style={{width:'61px',height:'32px'}}>确定</Button>
			</div>
		</DraggableModal>
	)
}
