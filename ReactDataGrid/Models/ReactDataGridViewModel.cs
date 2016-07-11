using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ReactDataGrid.Models
{
    public class ReactDataGridViewModel<TDataItemModel>
    {
        public IEnumerable<TDataItemModel> Items { get; set; }

        public int NOfItems { get; set; }

        public int NOfPages { get; set; }

        public int CurrentPage { get; set; }
    }
}