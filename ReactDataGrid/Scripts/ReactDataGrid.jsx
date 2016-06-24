
var ReactDataGrid = React.createClass({
// instantiation methods in order:
    getDefaultProps: function() {
        return {
            noDataMessage : "No data",
            defaultLoadParameters : {"page" : 1, "itemsOnPage" : 16, jumpToId : null},
            loadData :  this.prototype.loadData,
            loadErrorHandler :  this.prototype.loadErrorHandler,
            processDataRowFunc : this.prototype.processDataRowFunc,
            processHeadersRowFunc : this.prototype.processHeadersRowFunc,
            onRowClicked: this.prototype.onRowClicked
        }
    },

    getInitialState: function() {
       _.extend(this.props.defaultLoadParameters, this.props.loadParameters);
       _.extend(this.props.loadParameters, this.props.defaultLoadParameters);
        return {
            data: this.props.initialData,
            loadParameters: this.props.loadParameters
        };
    },

    componentWillMount: function() {
    },

    render: function() {
        var processDataRowFunc = this.props.processDataRowFunc.bind(this);
        var processHeadersRowFunc = this.props.processHeadersRowFunc.bind(this);
        var isNoData = !this.state.data || !this.state.data.Items || this.state.data.Items.length === 0;
        var noDataMessage = (this.dataLoaded === true && isNoData) ? this.props.noDataMessage : "";
        var isFirstPage = true;
        var isLastPage = true;
        if (this.state.data) {
            isFirstPage = (this.state.data.CurrentPage === 1);
            isLastPage = (this.state.data) ? (this.state.data.CurrentPage === this.state.data.NOfPages) : true;
        }

        return ( <div className={this.props.reactDataGridClass}>

                <div ref="spinner"  className={this.props.spinnerClass}>
                </div>

                { (isNoData) ? <div ref="noDataMessage" id="noDataMessage">{noDataMessage}</div> :
                <div>

                    <div>
                        <table className={this.props.tableClass}>
                            <thead>
                            {
                                processHeadersRowFunc()
                                }
                            </thead>

                            <tbody>
                            {
                                this.state.data.Items.map(function (row, idx) { return processDataRowFunc( row, idx);})
                                }
                            </tbody>

                        </table>
                    </div>


                    <div>
                        <input type="button" value="<<" disabled = {(isFirstPage === true)?"disabled":""}
                               style={(isFirstPage === true)?{"cursor":"default"} : {"cursor":"pointer"}}
                               onClick={(isFirstPage === true)? undefined : this.goToFirstPage}>
                        </input>
                        <input type="button" value="<" disabled = {(isFirstPage === true)?"disabled":""}
                               style={(isFirstPage === true)?{"cursor":"default"} : {"cursor":"pointer"}}
                               onClick={(isFirstPage === true)? undefined : this.goToPreviousPage}></input>
                        <span>{this.state.data.CurrentPage}</span>
                        <input type="button" value=">"  disabled = {(isLastPage === true)?"disabled":""}
                               style={(isLastPage === true)?{"cursor":"default"} : {"cursor":"pointer"}}
                               onClick={(isLastPage === true)? undefined : this.goToNextPage}></input>
                        <input type="button" value=">>"  disabled = {(isLastPage === true)?"disabled":""}
                               style={(isLastPage === true)?{"cursor":"default"} : {"cursor":"pointer"}}
                               onClick={(isLastPage === true)? undefined : this.goToLastPage}></input>
                    <span>
                        Page {this.state.data.CurrentPage} of {this.state.data.NOfPages}  ({this.state.data.NOfItems} records)
                    </span>
                    </div>

                </div>
                    }
            </div>
        );
    },

    sortHeader: function (header, sortBy) {
        return '<span onclick="rdcTesting.reactDataGrid.sort(\'' + sortBy + '\')">' + header
            +((this.state.loadParameters.sortBy === sortBy)?
                ( this.state.loadParameters.sortAsc?'<span>\u2191</span>' : '<span>\u2193</span>')
                : "") + '</span>';
    },

    processHeadersRowFunc: function()  {
        var sortHeader = this.sortHeader;
        return <tr>
            {
                this.props.gridStructure.map(function (val, idx) {
                    return <th key={idx} dangerouslySetInnerHTML={{__html:  val["Sortable"] === true?sortHeader( val["Header"], val["Field"]) : val["Header"]}}></th>
                    })
            }
        </tr>
    },

    processDataRowFunc: function(row, idx) {
        var onRowClicked = this.props.onRowClicked.bind(this);
        var tr = <tr ref={"row" + row['Id']}  key={idx} id={row['Id']} onClick={onRowClicked} style={{"cursor":"pointer"}}>
            {
                this.props.gridStructure.map(function (val, idx) {return <td key={idx}>{row[val["Field"]]}</td>})
            }
           </tr>
        return tr;
    },

    onRowClicked: function (e) {
        this.currentId = $(e.currentTarget).attr('id');
        this.highlightSelectedRow(e.currentTarget);
    },

    highlightSelectedRow: function(row) {
        if (this.currentRow) {
            $(this.currentRow).toggleClass("selected");
        }

        if (row) {
            this.currentRow = row;
            $(this.currentRow).toggleClass("selected");
        }
    },

    componentDidMount: function() {
        if (this.props.noLoadOnDidMount && this.props.noLoadOnDidMount === "true") {
            return;
        }
        if (!this.props.initialData) {
            this.props.loadData.call(this, {});
        }
    },

// end of instantiation methods
// Lifetime methods in order:

    componentWillReceiveProps: function() {
        return;
    },

    shouldComponentUpdate: function() {
        return true;
    },

    componentWillUpdate: function() {
        return;
    },

    componentDidUpdate: function() {
        return;
    },

    componentWillUnmount: function() {
    },

// end of lifetime methods

    loadData: function(loadParameters) {

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

    },

    onLoadStarted: function() {
        this.refs["spinner"].style.display = "block";
    },

    onLoadFinished: function() {
        this.refs["spinner"].style.display = "none";
    },

    loadErrorHandler: function (xMLHttpRequest) {
        console.error("Status: " + (xMLHttpRequest ? xMLHttpRequest.status : "No info") + " " + (xMLHttpRequest ? xMLHttpRequest.statusText : ""));
    },


    tryToJumpToId: function() {

        this.currentId  = this.state.loadParameters.jumpToId;

        try {
            if (!this.currentId || this.currentId < 0 || !(this.isIdInData(this.currentId))) {
                this.currentId = this.state.data.Items ?
                    (this.state.data.Items[0] ?
                        this.state.data.Items[0][this.props.idfield] : null) : null;
            }
        }
        catch(e){
            console.error(e.toString());
            this.currentId = null;
        }

        var row = this.refs["row" + this.currentId];
        this.highlightSelectedRow(row);
    },

    isIdInData: function(id) {
        if (!id || id < 0 || !this.state.data || !this.state.data.Items || this.state.data.Items.length === 0) {
            return false;
        }

        return _.some(this.state.data.Items, function(el) {
            return this.props && this.props.idfield && el[this.props.idfield] === id;
        });
    },

    sort: function(sortBy) {
        var sortAsc = !this.state.loadParameters.sortAsc;
        this.props.loadData.call(this, {sortAsc : sortAsc, sortBy : sortBy, page: 1});
    },

    goToPage: function(page) {

        if (page < 1) {
            page = 1;
        }

        if (page  > this.state.data.NOfPages)
        {
            page = this.state.data.NOfPages;
        }

        this.currentId = null;
        this.props.loadData.call(this, {page:page, jumpToId: this.currentId});
    },

    goToNextPage: function() {
        this.goToPage(this.state.data.CurrentPage + 1);
    },

    goToPreviousPage: function() {
        this.goToPage(this.state.data.CurrentPage - 1);
    },

    goToFirstPage: function() {
        this.goToPage(1);
    },

    goToLastPage: function() {
        this.goToPage(this.state.data.NOfPages);
    },
//////

    raiseEvent: function(eventHandler, eventArgs) {
        if (eventHandler) {
            eventHandler(this, eventArgs);
        }
    }
});

