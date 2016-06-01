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
// instantiation methods in order:
    getDefaultProps: function() {
        return {
            noDataMessage : "No data",
            defaultLoadParameters : {"page" : 1, "itemsOnPage" : 16, jumpToId : null},
            loadErrorHandler :  this.prototype.loadErrorHandler
        }
    },

    getInitialState: function() {
       _.extend(this.props.loadParameters, this.props.defaultLoadParameters);
        return {
            data: undefined,
            loadParameters: this.props.loadParameters
        };
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

    render: function() {
        var sortAsc = this.state.sortAsc;
        var idField = this.props.idField;
        var isPagerVisible = (this.state.data && this.state.data.NOfItems > 0) ? {display: 'block'} : {display: 'none'};
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

        return ( <div className={this.props.reactDataGridClass}>

                <div ref="spinner"  className={this.props.spinnerClass}>
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
    },

    componentDidMount: function() {
        if (this.props.noLoadOnDidMount && this.props.noLoadOnDidMount === "true") {
            return;
        }
        this.loadDataFromServer({});
    },
/////////////////////////////////
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
////////////////////////////////////

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

                if (this.props.loadErrorHandler){
                    this.props.loadErrorHandler(xhr);
                }

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

    loadErrorHandler: function (xMLHttpRequest) {
        alert("Status: " + (xMLHttpRequest ? xMLHttpRequest.status : "No info") + " " + (xMLHttpRequest ? xMLHttpRequest.statusText : ""));
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
        this.highlightSelectedRow(row);
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



    processOuterClick: function(idx) {
        this.loadDataFromServer({userId: idx, page: 1, jumpToId: this.jumpToId});
    },

    componentWillUnmount: function() {
        PubSub.unsubscribe(this.pubsub_token);
    }

});

