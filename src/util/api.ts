// 防抖函数
export function debounce(fn: () => void, delay: number = 1000) {
	let timer: ReturnType<typeof setTimeout> | null = null

	return function () {
		if (timer) {
			clearTimeout(timer)
			timer = null
		}
		timer = setTimeout(() => {
			fn.apply(this, arguments)
			timer = null
		}, delay)
	}
}

// 节流函数
export function throttle(fn: () => void, delay: number = 1000) {
	let timer: ReturnType<typeof setTimeout> | null = null

	return function () {
		if (!timer) {
			fn.apply(this, arguments)
			timer = setTimeout(() => {
				clearTimeout(timer!)
				timer = null
			}, delay)
		}
	}
}
