import ClipboardJS from "clipboard";

// 创建一个隐藏的按钮
const copyButton = document.createElement('button')
// 初始化clipboard实例
const clipboard = new ClipboardJS(copyButton)

/**
 * 复制指定文本到剪贴板
 * @param text 要复制到剪贴板的文本
 */
export function copyTextToClipboard(text: string) {
	(clipboard as any).text = () => text
	copyButton.click()
}
