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
            IWebElement pageIndicator = LoadStartPage(Driver);

            for (int page = 2; page < 8; page++)
            {
                PageUpElement.Click();
                TestPageNumber(pageIndicator, page);
            }

            for (int page = 6; page > 0; page--)
            {
                PageDownElement.Click();
                TestPageNumber(pageIndicator, page);
            }
        }

        [Test]
        public void Jump_To_The_LastFirst_Page()
        {
                IWebElement pageIndicator = LoadStartPage(Driver);

                PageLastElement.Click();

                TestPageNumber(pageIndicator, 7);

                PageFirstElement.Click();

                TestPageNumber(pageIndicator, 1);
        }

        protected IWebElement LoadStartPage(IWebDriver driver)
        {
            driver.Navigate().GoToUrl(StartUrl);
            new WebDriverWait(driver, Timeout).Until(ExpectedConditions.ElementExists(By.TagName("table")));
            IWebElement pageIndicator = driver.ExecuteJavaScript<IWebElement>("return $(':button[value=\"<\"]+span')[0]");
            Assert.AreEqual(pageIndicator.Text, "1");
            return pageIndicator;
        }

        protected void TestPageNumber(IWebElement pageIndicator, int page)
        {
            new WebDriverWait(Driver, Timeout).Until(ExpectedConditions.TextToBePresentInElement(pageIndicator, page.ToString()));
            Assert.AreEqual(page.ToString(), pageIndicator.Text);
        }
    }
}
