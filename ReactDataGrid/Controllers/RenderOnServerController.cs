using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ReactDataGrid.Models;

namespace ReactDataGrid.Controllers
{
    public class RenderOnServerController : Controller
    {
        //
        // GET: /RenderOnServer/

        public ActionResult Index()
        {
            ItemsController itemsController = new ItemsController();
            ItemsGridViewModel itemsGridViewModel = itemsController.GetItemsGridViewModel(1, "ID", true, 16, null);
            return View(itemsGridViewModel);
        }

    }
}
