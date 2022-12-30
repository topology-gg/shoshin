export function TreeString(lines, columnCount, rootColumn) {
    this.lines = lines;
    this.columnCount = columnCount;
    this.rootColumn = rootColumn;
}

TreeString.prototype = {

    constructor: TreeString,

    /** @return the number of lines */
    getLineCount: function () {
        return this.lines.length();
    },

    /** @return the number of columns */
    getColumnCount: function() {
        return this.columnCount;
    },

    /** @return the index of the column containing the center of the root */
    getRootColumn: function() {
        return this.rootColumn;
    },

    /** @return the number of columns to the right of the column containing the center of the root */
    getRootColumnFromRight: function() {
        return this.getColumnCount() - (this.getRootColumn() + 1);
    },

    /** @return the line at {@code index} */
    getLine: function(index) {
        return this.lines[index];
    },
}