using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using NUnit.Framework;
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium.Support.Extensions;
using OpenQA.Selenium.Support.UI;

namespace ReactDataGridTests
{
    [TestFixture]
    public class Paging : Base
    {
        [Test]
        public void Can_Page_Up_And_Down()
        {
            for (int page = 2; page < 8; page++)
            {
                PageUpElement.Click();
                TestPageNumber(page);
            }

            for (int page = 6; page > 0; page--)
            {
                PageDownElement.Click();
                TestPageNumber(page);
            }
        }

        [Test]
        public void Jump_To_The_LastFirst_Page()
        {
                PageLastElement.Click();

                TestPageNumber(7);

                PageFirstElement.Click();

                TestPageNumber(1);
        }
    }
}
