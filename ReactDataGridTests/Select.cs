using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using NUnit.Framework;
using OpenQA.Selenium;
using OpenQA.Selenium.Support.UI;

namespace ReactDataGridTests
{
    [TestFixture]
    public class Select : Base
    {
        [Test]
        public void Is_First_Row_Selected_When_Loaded()
        {
            Driver.Manage().Timeouts().ImplicitlyWait(new TimeSpan(0, 0, 15)); 
            IWebElement selectedRow = Driver.FindElement(By.ClassName("selected"));
            IWebElement firstRow = GridRow(0);

            Assert.AreEqual(selectedRow.TagName, firstRow.TagName);
            Assert.AreEqual(selectedRow.Text, firstRow.Text);
        }

        [Test]
        public void Are_Rows_Selectable_OnAllPages()
        {
            Driver.Manage().Timeouts().ImplicitlyWait(new TimeSpan(0, 0, 15));
            Are_Rows_Selectable_OnTheCurrentPage(1);

            for (int page = 2; page <= 7; page++)
            {
                PageUpElement.Click();
                new WebDriverWait(Driver, Timeout).Until(ExpectedConditions.TextToBePresentInElement(PageIndicator, page.ToString()));
                Are_Rows_Selectable_OnTheCurrentPage(page);
            }
        }

        private void Are_Rows_Selectable_OnTheCurrentPage(int page)
        {
            for (int i = 0; i <= ( page==7 ? 3 : 15 ); i++)
            {
                IWebElement row = GridRow(i);
                new WebDriverWait(Driver, Timeout).Until(ExpectedConditions.ElementToBeClickable(row));
                row.Click();
                IWebElement selectedRow = Driver.FindElement(By.ClassName("selected"));

                Assert.AreEqual(selectedRow.TagName, row.TagName);
                Assert.AreEqual(selectedRow.Text, row.Text);
            }
        }
    }
}
