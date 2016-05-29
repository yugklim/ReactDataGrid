(function (rdcTesting) {

function sortHeader (header, sortBy) {
    return '<span onclick="rdcTesting.reactDataGrid.sort(\'' + sortBy + '\')">' + header
    +((this.state.loadParameters.sortBy === sortBy)?
            ( this.state.loadParameters.sortAsc?'<span>\u2191</span>' : '<span>\u2193</span>')
        : "") + '</span>';
};

function headerTemplate()  {
    var idHeader = sortHeader.call(this, "Id", "Id");
    var field0Header = sortHeader.call(this, "Field 0", "Field0");
    return <tr>
        <th style={{"cursor":"pointer", "width":"10%"}} title="sort by id" dangerouslySetInnerHTML={{__html: idHeader}}></th>
        <th style={{"cursor":"pointer", "width":"30%"}} title="sort by field0" dangerouslySetInnerHTML={{__html: field0Header}}></th>
        <th style={{"width":"30%"}}>Field 1</th>
        <th>Choice</th>
        <th>Action</th>
    </tr>
};

function dataRowTemplate(row, idx) {
    var tr = <tr ref={"row" + row['Id']}  key={idx} id={row['Id']} onClick={onRowClicked} style={{"cursor":"pointer"}}>
        <td>{row['Id']}</td>
        <td>{row['Field0']}</td>
        <td>{row['Field1']}</td>
        <td>
            <select>
                <option selected>Field 0</option>
                <option>Field 1</option>
                <option>Field 2</option>
            </select>
        </td>
        <td><input type="button" value="Action"/></td>
    </tr>;
    return tr;
};

function onRowClicked (e) {
        rdcTesting.reactDataGrid.jumpToId = $(e.currentTarget).attr('id');
        rdcTesting.reactDataGrid.highlightSelectedRow(e.currentTarget);
};

function loadErrorHandler (xMLHttpRequest) {
    alert("Status: " + (xMLHttpRequest ? xMLHttpRequest.status : "No info") + " "
        + (xMLHttpRequest ? xMLHttpRequest.statusText : ""));
};

rdcTesting.reactDataGrid = ReactDOM.render(
    <ReactDataGrid
        url="/Items"
        processHeadersRowFunc = {headerTemplate}
        processDataRowFunc = {dataRowTemplate}
        noDataMessage="No data"
        reactDataGridClass="reactDataGrid"
        tableClass="table table-striped"
        spinnerClass="spinner"
        idfield="Id"
        loadParameters={{"sortAsc" : false, "sortBy": "Field0", "search" : "", "page" : 1, "contains" : false, "itemsOnPage" : 16, jumpToId : null}}
        loadErrorHandler = {loadErrorHandler}
    />,

    document.getElementById('content')
);

}(window.rdcTesting = window.rdcTesting || {}));