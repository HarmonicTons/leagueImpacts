define(function () {

	/**
	 * Axe Cursor Model
	 */
	function AxeCursor(axe, elementId, position){
		this.axe = axe;
		this.type = axe.type;
		this.position = position;
		this.element = axe.addTick(position, "cursor"); // ...
		this.label = this.element.children[this.element.children.length - 1];
		// ! different if vertical

		this.moveTo = function(position){
			var value = this.axe.getValueFromPosition(position);
			this.element.style[this.axe.styleOffset] = position + "%";
			this.position = position;
			this.label = value.toFixed(1) + "%";
		}
	}
	return AxeCursor;
});