export default class EventBus{
    event: { [key: string]: Function[] };
	constructor(){
		this.event = {};
		// console.log(this)
	}
	/**
	 *
	 * @param {string} eventName
	 * @param {Function} callback
	 */
	subscribe(eventName: string, callback: (...arg: any[])=>void){
		if (!this.event[eventName]) {
			this.event[eventName] = [];
		}
		this.event[eventName].push(callback);
	}

	/**
	 *
	 * @param {string} eventName
	 * @param {Function} callback
	 * @returns
	 */
	unSubscribe(eventName: string, callback: (...arg: any[])=>void){
		if (!this.event[eventName]) return;
		this.event[eventName] = this.event[eventName].filter(cb => cb !== callback);
	}

	/**
	 *
	 * @param {string} eventName
	 * @param {any} payload
	 * @returns {void}
	 */
	dispatch(eventName: string, ...payload: any[]){
		if (!this.event[eventName]) return;
		this.event[eventName].forEach(cb => {
			cb(...payload);
			// console.log(`Event ${eventName} has been dispatched`);
        });
	}
}
