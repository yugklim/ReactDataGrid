using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Web;
using System.Web.Mvc;
using ReactDataGrid.Models;

namespace ReactDataGrid.Controllers
{
    public class ItemsController : Controller
    {
        private List<ItemModel> itemModels;
        public ItemsController()
        {
            itemModels = new List<ItemModel>();
            for (int item = 1; item <= 100; item++)
            {
                itemModels.Add(new ItemModel()
                {
                    Id = item,
                    Field0 = FieldFormat(item, 0),
                    Field1 = FieldFormat(item, 1),
                    Field2 = FieldFormat(item, 2),
                    Field3 = FieldFormat(item, 3),
                    Field4 = FieldFormat(item, 4),
                    Field5 = FieldFormat(item, 5),
                    Field6 = FieldFormat(item, 6),
                    Field7 = FieldFormat(item, 7),
                    Field8 = FieldFormat(item, 8),
                    Field9 = FieldFormat(item, 9)
                });
            }
        }

        private static string FieldFormat(int item, int field)
        {
            return string.Format("Item {0} Field{1}", item, field);
        }

        public ActionResult Index(int page, string search, bool contains, string sortBy, bool sortAsc, int itemsOnPage = 10, int? jumpToId = null)
        {
            ItemsGridViewModel itemsGridViewModel = new ItemsGridViewModel()
            {
                Items = new List<ItemModel>(),
                NOfItems = 0,
                NOfPages = 0,
                CurrentPage = 0
            };

            if (page <= 0 || itemsOnPage <= 0)
            {
                return Json(itemsGridViewModel, JsonRequestBehavior.AllowGet);
            }

            search = HttpUtility.HtmlEncode(search);
            int nOfItems, nOfPages;

            IEnumerable<ItemModel> itemModels = GetItems(out nOfItems, out nOfPages, ref page, search, contains, sortBy, sortAsc, itemsOnPage, jumpToId);

            itemsGridViewModel.Items = itemModels;
            itemsGridViewModel.NOfItems = nOfItems;
            itemsGridViewModel.NOfPages = nOfPages;
            itemsGridViewModel.CurrentPage = page;

            Thread.Sleep(1000);
            return Json(itemsGridViewModel, JsonRequestBehavior.AllowGet);
        }

        public IEnumerable<ItemModel> GetItems(out int nOfItems, out int nOfPages, ref int page, string search, bool contains, string sortBy, bool sortAsc, int itemsOnPage, int? jumpToId)
        {
            if (search == null || page <= 0 || itemsOnPage <= 0)
            {
                nOfItems = 0;
                nOfPages = 0;
                return new List<ItemModel>();
            }

            IQueryable<ItemModel> itemsFound = itemModels.AsQueryable().Where(u => (contains ? u.Field0.Contains(search) : u.Field0.StartsWith(search)));
            IOrderedEnumerable<ItemModel> itemsOrdered;

            switch (sortBy)
            {
                case "Field1":
                    Func<ItemModel, string> sortByField1 = n => n.Field1;
                    itemsOrdered = sortAsc ? itemsFound.OrderBy(sortByField1) : itemsFound.OrderByDescending(sortByField1);
                    break;
                default:
                    Func<ItemModel, string> sortByField0 = n => n.Field0;
                    itemsOrdered = sortAsc ? itemsFound.OrderBy(sortByField0) : itemsFound.OrderByDescending(sortByField0);
                    break;
            }

            BasicGridOperations.GetPageForItem(ref page, itemsOrdered.ToList(), u => u.Id == jumpToId, jumpToId, itemsOnPage);
            IEnumerable<ItemModel> itemsPaged = itemsOrdered.Skip((page - 1) * itemsOnPage).Take(itemsOnPage);
            nOfItems = itemsOrdered.Count();
            nOfPages = BasicGridOperations.GetNumberOfPages(nOfItems, itemsOnPage);
            return itemsPaged;
        }

    }
}
