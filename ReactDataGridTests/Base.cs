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
    public class Base : IDisposable
    {
        protected string StartUrl { get; set; }

        protected string DriverPath { get; set; }

        public TimeSpan Timeout { get; set; }

        protected IWebDriver Driver { get; set; }

        protected IWebElement PageFirstElement
        {
            get
            {
                return Driver.ExecuteJavaScript<IWebElement>("return $(':button[value=\"<<\"]')[0]");
            }
        }
        
        protected IWebElement PageDownElement
        {
            get
            {
                return Driver.ExecuteJavaScript<IWebElement>("return $(':button[value=\"<\"]')[0]");
            }
        }

        protected IWebElement PageUpElement
        {
            get
            {
                return Driver.ExecuteJavaScript<IWebElement>("return $(':button[value=\">\"]')[0]");
            }
        }

        protected IWebElement PageLastElement
        {
            get
            {
                return Driver.ExecuteJavaScript<IWebElement>("return $(':button[value=\">>\"]')[0]");
            }
        }

        protected IWebElement PageIndicator
        {
            get
            {
                return Driver.ExecuteJavaScript<IWebElement>("return $(':button[value=\"<\"]+span')[0]");
            }
        }

        protected IWebElement IdHeader
        {
            get
            {
                return Driver.ExecuteJavaScript<IWebElement>("return $('th:nth-child(1)>span')[0]");
            }
        }

        protected IWebElement Field0Header
        {
            get
            {
                return Driver.ExecuteJavaScript<IWebElement>("return $('th:nth-child(2)>span')[0]");
            }
        }

        protected IWebElement Field1Header
        {
            get
            {
                return Driver.ExecuteJavaScript<IWebElement>("return $('th:nth-child(3)>span')[0]");
            }
        }

        protected IWebElement GridCell(int row, int column)
        {
            return Driver.ExecuteJavaScript<IWebElement>(string.Format("return $('tr:nth-child({0})>td:nth-child({1})')[0]", row + 1, column + 1));
        }

        protected IWebElement GridRow(int row)
        {
            return Driver.ExecuteJavaScript<IWebElement>(string.Format("return $('tr')[{0}]", row + 1));
        }

        protected IWebElement GridRowById(int rowId)
        {
            return Driver.ExecuteJavaScript<IWebElement>(string.Format("return $('tr[id={0}]')[0]", rowId));
        }

        protected IWebElement GoTo2NdPageButton
        {
            get
            {
                return Driver.ExecuteJavaScript<IWebElement>("return $('#goTo2NdPageButton')[0]");
            }
        }

        protected IWebElement GoToMinus999PageButton
        {
            get
            {
                return Driver.ExecuteJavaScript<IWebElement>("return $('#goTo-999PageButton')[0]");
            }
        }

        protected IWebElement NoDataMessageElement
        {
            get
            {
                return Driver.ExecuteJavaScript<IWebElement>("return $('#noDataMessage')[0]");
            }
        }

        public Base()
        {
            StartUrl = @"http://localhost:22404/ReactDataGridTest";
            DriverPath = @"D:\Selenium_Chrome";
            Timeout = new TimeSpan(0, 0, 10);
            Driver = new ChromeDriver(DriverPath);
        }

        [SetUp]
        public void Init()
        {
            LoadStartPage();
        }

        [TearDown]
        public void Close()
        {
           
        }

        protected void GoToStartUrl()
        {
            Driver.Navigate().GoToUrl(StartUrl);
        }

        protected void LoadStartPage()
        {
            Driver.Navigate().GoToUrl(StartUrl);
            new WebDriverWait(Driver, Timeout).Until(ExpectedConditions.ElementExists(By.TagName("table")));
            Assert.AreEqual(PageIndicator.Text, "1");
        }

        protected void TestPageNumber(int page)
        {
            new WebDriverWait(Driver, Timeout).Until(ExpectedConditions.TextToBePresentInElement(PageIndicator, page.ToString()));
            Assert.AreEqual(page.ToString(), PageIndicator.Text);
        }

        protected void TestNoDataMessagePresence()
        {
            new WebDriverWait(Driver, Timeout).Until(ExpectedConditions.ElementExists(By.Id("noDataMessage")));
            Assert.IsNotNull(NoDataMessageElement);
        }

        protected bool IsNthRowSelected(int rowIdx)
        {
            IWebElement row = GridRowById(rowIdx);
            IWebElement selectedRow = Driver.FindElement(By.ClassName("selected"));
            return selectedRow.TagName == row.TagName && selectedRow.Text == row.Text;
        }

        public void Dispose()
        {
            Driver.Close();
            Driver.Dispose();
        }
    }
}
