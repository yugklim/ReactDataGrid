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

        protected IWebElement GridCell(int row, int column)
        {
            return Driver.ExecuteJavaScript<IWebElement>(string.Format("return $('tr:nth-child({0})>td:nth-child({1})')[0]", row + 1, column + 1));
        }

        protected IWebElement GridRow(int row)
        {
            return Driver.ExecuteJavaScript<IWebElement>(string.Format("return $('tr')[{0}]", row + 1));
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


        public void Dispose()
        {
            Driver.Close();
            Driver.Dispose();
        }
    }
}
