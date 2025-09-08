// 路由相关
import {createBrowserRouter, Navigate} from "react-router-dom";
import LoginPage from "@views/login-page/LoginPage.tsx";
import NotFound from "@views/not-found/NotFound.tsx";
import Layout from "@/layout/LayoutPage.tsx";
import Index from "@views/index/IndexPage.tsx";
import ModuleOne from "@views/module-one/ModuleOne.tsx";
import ModuleOneDetail from "@views/module-one/detail/ModuleOneDetail.tsx";
import ModuleTwo from "@views/module-two/ModuleTwo.tsx";
import ModuleFour from "@views/module-four/ModuleFour.tsx";
import PersonCenter from "@views/person-center/PersonCenter.tsx";
import TestComp from "@views/test/TestComp.tsx";

export const router = createBrowserRouter([
	// 登录页面
	{
		path: '/login',
		element: <LoginPage/>,
	},
	// 普通页面
	{
		path: '/',
		element: <Layout/>,
		children: [
			{
				path: '',
				element: <Navigate to={'/index'} replace/>,
			},
			{
				path: 'index',
				element: <Index/>,
			},
			{
				path: 'module-one',
				element: <ModuleOne/>,
			},
			{
				path: 'module-one/detail/:id',
				element: <ModuleOneDetail/>,
			},
			{
				path: 'module-two',
				element: <ModuleTwo/>,
			},
			{
				path: 'module-four',
				element: <ModuleFour/>,
			},
			{
				path: 'person-center',
				element: <PersonCenter/>,
			},
		],
	},
	// 测试
	{
		path: '/test',
		element: <TestComp/>,
	},
	// 404
	{
		path: '*',
		element: <NotFound/>,
	},
])
