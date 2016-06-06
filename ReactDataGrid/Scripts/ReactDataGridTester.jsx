﻿(function (rdcTesting) {

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

function ownLoadErrorHandler (xMLHttpRequest) {
    alert("Own Handler ");
};

function onBeforeLoadData(component, eventArgs) {
    rdcTesting.beforeLoadPars = eventArgs;
    $("#loadParsBeforeLoading").html(loadParsToHtml(rdcTesting.beforeLoadPars, rdcTesting.afterLoadPars));
}

function onDataLoadedOK(component, eventArgs) {
    rdcTesting.afterLoadPars = eventArgs;
    $("#loadParsAfterLoading").html(loadParsToHtml(rdcTesting.afterLoadPars, rdcTesting.beforeLoadPars));
}

function loadParsToHtml(loadPars, parsToCompare) {
    if (parsToCompare !== undefined && parsToCompare !== null) {
        return _.reduce(loadPars, function (memo, val, key, list) {

            return memo +
                ((loadPars[key] === parsToCompare[key]) ?
                _.template("<div><%= key %>: <%= val %></div>")({key: key, val: val}) :
                _.template("<div style='color:red'><%= key %>: <%= val %></div>")({key: key, val: val}));
        }, "");
    }
    else
    {
        return _.reduce(loadPars, function (memo, val, key, list) {
            return memo + _.template("<div><%= key %>: <%= val %></div>")({key: key, val: val})
        }, "");
    }
}

function x(loadParameters) {

    alert ('I am x!')

    var buildQueryString = function (loadParameters){
        if (!loadParameters) {
            return "";
        }
        var retVal = "";
        var keys = Object.keys(loadParameters);
        for (var i = 0; i < keys.length; ++i){
            retVal += keys[i] + '=' + loadParameters[keys[i]] + '&';
        }
        return retVal;
    };

    this.raiseEvent(this.props.onBeforeLoadData, this.state.loadParameters);
    this.dataLoaded = true;
    this.onLoadStarted();
    var cloneOfStateLoadParameters = _.clone(this.state.loadParameters);
    _.extend(cloneOfStateLoadParameters, loadParameters);

    var xhr = new XMLHttpRequest();
    xhr.open('get', this.props.url + '?' + buildQueryString(cloneOfStateLoadParameters), true);
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function() {
        this.onLoadFinished();
        if(xhr.status == 200) {

            var data = JSON.parse(xhr.responseText);
            this.setState({
                data: data,
                loadParameters: cloneOfStateLoadParameters
            });

            this.tryToJumpToId();
            this.raiseEvent(this.props.onDataLoadedOK, this.state.loadParameters);
        }
        else {
            if (this.props.loadErrorHandler){
                this.props.loadErrorHandler(xhr);
            }
            this.raiseEvent(this.props.onDataLoadedFault, this.state.loadParameters);
        }

    }.bind(this);

    xhr.onreadystatechange=function(data) {
        this.onLoadFinished();
    }.bind(this);

    xhr.send();

    }

rdcTesting.reactDataGrid = ReactDOM.render(
    <ReactDataGrid
        // obligatory parameters
        url="/Items"
        processHeadersRowFunc = {headerTemplate}
        processDataRowFunc = {dataRowTemplate}
        noDataMessage="No data"
        reactDataGridClass="reactDataGrid"
        tableClass="table table-striped"
        spinnerClass="spinner"
        idfield="Id"
        loadParameters={{"sortAsc" : false, "sortBy": "Field0"}}
        // non obligatory parameters
        //loadErrorHandler = {ownLoadErrorHandler}
        onBeforeLoadData={onBeforeLoadData}
        onDataLoadedOK={onDataLoadedOK}
        //loadData={x}
    />,

    document.getElementById('content')
);

}(window.rdcTesting = window.rdcTesting || {}));