(function (rdcTesting) {
    rdcTesting.multiselect = function() {
        rdcTesting.reactDataGrid2 = ReactDOM.render(
            <ReactDataGrid
                url='/Items'
                gridStructure={[{Header: 'Id', Field: 'Id', Sortable: false},{Header: 'Field0', Field: 'Field0', Sortable: true}, {Header: 'Field1', Field: 'Field1'}]}
                idfield='Id'
                noDataMessage='No data'
                reactDataGridClass='reactDataGrid'
                tableClass='table table-striped'
                spinnerClass='spinner'
				multiSelection={true}
                loadParameters={{'sortAsc' : 'false', 'sortBy': 'Field0', 'jumpToId': null}}
                //noLoadOnDidMount = {false}
            />,
            document.getElementById('content')
        );
       //rdcTesting.reactDataGrid2.loadData({'sortAsc' : 'true', 'sortBy': 'Field0', 'jumpToId': null});
    }
}(window.rdcTesting = window.rdcTesting || {}));