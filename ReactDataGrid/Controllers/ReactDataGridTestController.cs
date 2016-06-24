using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ReactDataGrid.Models;

namespace ReactDataGrid.Controllers
{
    public class ReactDataGridTestController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        //public ActionResult RenderOnServer(int page, string sortBy, bool sortAsc, int itemsOnPage = 10, int? jumpToId = null)
        //{

        //    return View();
        //}

    }
}
