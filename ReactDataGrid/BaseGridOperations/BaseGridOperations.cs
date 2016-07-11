using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ReactDataGrid
{
    public class BasicGridOperations
    {
        public static int GetNumberOfPages(int nOfItems, int itemsOnPage)
        {
            if (nOfItems <= 0 || itemsOnPage <= 0)
            {
                return 0;
            }

            return itemsOnPage == 0 ? 0 : (int)Math.Ceiling((double)nOfItems / itemsOnPage);
        }

        public static void GetPageForItem<TItem>(ref int page, List<TItem> items, Func<TItem, bool> selectFunc, int? jumpToId, int itemsOnPage)
        {
            if (items == null || !items.Any() || itemsOnPage <= 0 || selectFunc == null)
            {
                page = 0;
                return;
            }

            if (jumpToId == null)
            {
                return;
            }

            TItem item = items.FirstOrDefault(selectFunc);
            if (item == null)
            {
                return;
            }

            int idxOfItem = items.IndexOf(item) + 1;
            if (idxOfItem == 1)
            {
                page = 1;
                return;
            }

            page = (int)Math.Ceiling((double)idxOfItem / itemsOnPage);
        }
    }
}