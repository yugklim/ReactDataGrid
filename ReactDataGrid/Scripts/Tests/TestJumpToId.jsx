(function (rdcTesting) {
    rdcTesting.renderJumpToId = function(jumpToId) {
        rdcTesting.reactDataGrid = ReactDOM.render(
            <ReactDataGrid
                url='/Items'
                gridStructure={[{Header: 'Id', Field: 'Id', Sortable: false},{Header: 'Field0', Field: 'Field0', Sortable: true}, {Header: 'Field1', Field: 'Field1'}]}
                idfield='Id'
                noDataMessage='No data'
                reactDataGridClass='reactDataGrid'
                tableClass='table table-striped'
                spinnerClass='spinner'
            />,
            document.getElementById('content')
        );
        rdcTesting.reactDataGrid.loadData({'jumpToId' : jumpToId});
    }
}(window.rdcTesting = window.rdcTesting || {}));