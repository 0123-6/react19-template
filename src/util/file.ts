// 通用接口定义
export interface ISelectFileProps {
	// 要设置的HTML元素
	element: HTMLElement,
	// 接收的文件类型，同input元素的accept属性,''代表所有类型
	accept: string,
	// 选中文件后的回调函数
	callback: (file: File) => void,
	// 选中文件，但是存在错误后的回调函数
	callbackError: (text: string) => void,
}

/**
 * 检查文件类型是否符合要求
 * @param accept 允许的文件类型（MIME类型或文件扩展名，如 'text/plain, .txt, .pdf, image/*'）
 * @param file 要检查的文件
 * @returns 是否符合要求
 */
function isValidFileType(accept: string, file: File): boolean {
	const acceptedTypes = accept.split(',').map(type => type.trim());

	const fileTypeMatches = acceptedTypes.some(type => {
		if (type.includes('/*')) {
			const [mainType] = type.split('/');
			const [fileMainType] = file.type.split('/');
			return mainType === fileMainType;
		}
		return file.type === type;
	});

	const fileExtensionMatches = acceptedTypes.some(type => file.name.endsWith(type));

	return fileTypeMatches || fileExtensionMatches;
}

// 选择文件实用函数
export function ableSelectFileByClick(props: ISelectFileProps): () => void {
	const {
		element,
		accept,
		callback,
		callbackError,
	} = props

	const handleClick = () => {
		// 手动创建input元素
		const inputElement = document.createElement('input')
		inputElement.type = 'file'
		inputElement.accept = accept

		const handleChange = () => {
			const file = inputElement.files?.[0]
			if (file) {
				if (accept === '' || isValidFileType(accept, file)) {
					callback(file)
				} else {
					callbackError('选中的文件格式错误')
				}
			} else {
				callbackError('文件读取失败')
			}
			// 移除事件处理器
			inputElement.removeEventListener('change', handleChange)
		}

		inputElement.addEventListener('change', handleChange)
		inputElement.click()
	}

	// 添加点击事件回调函数
	element.addEventListener('click', handleClick)

	// 返回清理函数
	return () => {
		element.removeEventListener('click', handleClick)
	}
}

// 将普通HTML元素可以通过拖拽读取文件，需要在DOM绑定后调用一次
export function ableSelectFileByDrag(props: ISelectFileProps): () => void {
	const {
		element,
		accept,
		callback,
		callbackError,
	} = props

	const handleDragEnter = (e: DragEvent) => {
		e.stopPropagation()
		e.preventDefault()
	}

	const handleDragOver = (e: DragEvent) => {
		e.stopPropagation()
		e.preventDefault()
	}

	const handleDrop = (e: DragEvent) => {
		e.stopPropagation()
		e.preventDefault()
		const file = e.dataTransfer?.files[0]
		if (file) {
			if (accept === '' || isValidFileType(accept, file)) {
				callback(file)
			} else {
				callbackError('选中的文件格式错误')
			}
		} else {
			callbackError('文件读取失败')
		}
	}

	// 添加点击事件回调函数
	element.addEventListener('dragenter', handleDragEnter)
	element.addEventListener('dragover', handleDragOver)
	element.addEventListener('drop', handleDrop)

	// 返回清理函数
	return () => {
		element.removeEventListener('dragenter', handleDragEnter)
		element.removeEventListener('dragover', handleDragOver)
		element.removeEventListener('drop', handleDrop)
	}
}

export interface IExportFileProps {
	file: File
	callback: () => void
	callbackError: (text: string) => void
}

export function exportFile(props: IExportFileProps) {
	const {file, callback, callbackError} = props

	if (file.size === 0) {
		callbackError('文件为空，无法导出')
		return
	}

	const url = URL.createObjectURL(file)
	const a = document.createElement('a')
	a.href = url
	a.download = file.name
	document.body.appendChild(a)
	a.click()

	document.body.removeChild(a)
	URL.revokeObjectURL(url)

	callback()
}
