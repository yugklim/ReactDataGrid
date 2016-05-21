function getQueryString(loadParameters) {
    if (!loadParameters) {
        return "";
    }

    var retVal = "";
    var keys = Object.keys(loadParameters);
    for (var i = 0; i < keys.length; ++i){
        retVal += keys[i] + '=' + loadParameters[keys[i]] + '&';
    }
    return retVal;
}

var ReactDataGrid = React.createClass({

    getDefaultProps: function() {
        return {
            noDataMessage : "No data"
        }
    },

    getInitialState: function() {
        return {
            data: undefined,
            loadParameters: this.props.loadParameters
        };
    },

    // complements the loadParameters with the state.LoadParameters values
    completeLoadParameters: function (loadParameters) {
        _.each(this.state.loadParameters, function(val, key) {
            if (loadParameters[key] === null || loadParameters[key] === undefined){
                loadParameters[key] = val;
            }
        });
    },

    loadDataFromServer: function(loadParameters) {
        this.dataLoaded = true;
        this.loadingHandler();
        this.completeLoadParameters(loadParameters);
        var xhr = new XMLHttpRequest();
        xhr.open('get', this.props.url + '?' + getQueryString(loadParameters), true);
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onload = function() {
            this.loadingFinishedHandler();
            if(xhr.status == 200) {
                var data = JSON.parse(xhr.responseText);
                this.setState({
                    data: data,
                    loadParameters: loadParameters
                });

                this.tryToJumpToId();
            }
            else {
                if (this.props.loadErrorHandler){
                    this.props.loadErrorHandler(xhr);
                }
            }

        }.bind(this);

        xhr.onreadystatechange=function(data) {
            this.loadingFinishedHandler();
        }.bind(this);

        xhr.send();

    },

    tryToJumpToId: function() {

        try {
            if (!this.jumpToId || this.jumpToId < 0 || !(this.isIdInData(this.jumpToId))) {
                this.jumpToId = this.state.data.Items ?
                    (this.state.data.Items[0] ?
                        this.state.data.Items[0][this.props.idfield] : -99) : -99;
            }
        }
        catch(e){
            this.jumpToId = -99;
        }

        var row = this.refs["row" + this.jumpToId];
        this.props.setCurrentRow(this.jumpToId, row);
    },

    isIdInData: function(id) {

        if (!id || id < 0 || !this.state.data || !this.state.data.Items || this.state.data.Items.length === 0) {
            return false;
        }

        var items = this.state.data.Items;
        console.log(items);
        for (var i = 0; i < items.length; ++i) {
            console.log(items[i]);
            if (items[i][this.props.idfield] == id) {
                return true;
            }
        }

        return false;
    },

    refresh: function() {
        this.loadDataFromServer({jumpToId: this.jumpToId});
    },

    ownDataRowClickHandler: function(id) {
        this.jumpToId = id;
    },

    loadingHandler: function() {
        //this.refs["noDataMessage"].style.display = "none";
        this.refs["spinner"].style.display = "block";
    },

    loadingFinishedHandler: function() {
        //this.refs["noDataMessage"].style.display = "block";
        this.refs["spinner"].style.display = "none";
    },

    sort: function(sortBy) {
        var sortAsc = !this.state.loadParameters.sortAsc;
        this.loadDataFromServer({sortAsc : sortAsc, sortBy : sortBy, page: 1});
    },

    containsChanged: function(e) {
        var contains = (e.target.value === "Contains" &&  e.target.checked);
        this.loadDataFromServer({contains: contains, page: 1});
    },

    goToPage: function(page) {

        if (page < 1) {
            page = 1;
        }

        if (page  > this.state.data.NOfPages)
        {
            page = this.state.data.NOfPages;
        }

        this.jumpToId = -99;
        this.loadDataFromServer({page:page, jumpToId: this.jumpToId});
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

    componentWillMount: function() {
        if (this.props.eventToSubscribe) {
            this.pubsub_token = PubSub.subscribe(this.props.eventToSubscribe, function (topic, idx) {
                if (this.props.outerClickHandler){
                    this.props.outerClickHandler(idx)
                }
            }.bind(this));
        }
    },

    processOuterClick: function(idx) {
        this.loadDataFromServer({userId: idx, page: 1, jumpToId: this.jumpToId});
    },

    componentWillUnmount: function() {
        PubSub.unsubscribe(this.pubsub_token);
    },


    componentDidMount: function() {
        if (this.props.noLoadOnDidMount && this.props.noLoadOnDidMount === "true") {
            return;
        }
        this.loadDataFromServer({});
    },

    search: function(newProps) {
        this.loadDataFromServer({search: newProps.search, page: 1});
    },

    clearCurrentRow: function() {
        if (this.currentRow) {
            this.currentRow.className = "";
        }
    },

    render: function() {
        var sortAsc = this.state.sortAsc;
        var idField = this.props.idField;
        var isPagerVisible = (this.state.data && this.state.data.NOfItems > 0) ? {display: 'block'} : {display: 'none'};
        var showSearchControls = this.props.showSearchControls === "true" ? {display: 'block'} : {display: 'none'};
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
        var spinnerWidth = (this.props.spinnerWidth)? this.props.spinnerWidth : "";
        var spinnerLeft = (this.props.spinnerLeft)? this.props.spinnerLeft : "";
        var width = (this.props.width)? this.props.width : "";
        this.clearCurrentRow();

        return ( <div className={this.props.reactDataGridClass} >

                <div ref="spinner" id={this.props.loadingId} className={this.props.spinnerClass}>
                </div>
                <h1>{this.props.title}</h1>

                <div style={showSearchControls}>
                    Search:
                    <div className={this.props.filterClass}>
                        <div className={this.props.searchWordClass}>
                            <input type="text" onChange={this.search} />
                        </div>
                        <div className={this.props.startsClass}>
                            <input type="radio" name="contains" value="StartsWith" defaultChecked onChange={this.containsChanged} />
                            <label className="form-field-label">Starts with</label>
                        </div>
                        <div className={this.props.containsClass}>
                            <input type="radio" name="contains" value="Contains" onChange={this.containsChanged} />
                            <label className="form-field-label">Contains</label>
                        </div>
                    </div>
                </div>



                { (isNoData) ? <div ref="noDataMessage">{noDataMessage}</div> :
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
                                this.state.data.Items.map(function (row, idx) { return processDataRowFunc(row, idx); })
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
    }
});

