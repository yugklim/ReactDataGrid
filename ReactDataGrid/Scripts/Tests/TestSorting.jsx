(function (rdcTesting) {

    rdcTesting.renderDefault = function(gridStructure) {
        gridStructure = (gridStructure=== undefined || gridStructure === null)?
        [{Header: 'Id', Field: 'Id', Sortable: false},{Header: 'Field0', Field: 'Field0', Sortable: true}, {Header: 'Field1', Field: 'Field1'}] : gridStructure;
        rdcTesting.reactDataGrid = ReactDOM.render(
            <ReactDataGrid
                url='/Items'
                gridStructure={[{Header: 'Id', Field: 'Id', Sortable: false},
                                {Header: 'Field0', Field: 'Field0', Sortable: true},
                                {Header: 'Field1', Field: 'Field1'}]}
                idfield='Id'

                noDataMessage='No data'
                reactDataGridClass='reactDataGrid'
                tableClass='table table-striped'
                spinnerClass='spinner'
                loadParameters={{'sortAsc' : false, 'sortBy': 'Field0'}}
            />,
            document.getElementById('content')
        );

    }

}(window.rdcTesting = window.rdcTesting || {}));