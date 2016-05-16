using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using NUnit.Framework;
using OpenQA.Selenium;
using OpenQA.Selenium.Support.Extensions;
using OpenQA.Selenium.Support.UI;

namespace ReactDataGridTests
{
    [TestFixture]
    public class Sorting: Base
    {
        [Test]
        public void Sort_By_Field()
        {
            IWebElement firstCell = GridCell(0, 0);
            IWebElement secondCell = GridCell(0, 1);
            new WebDriverWait(Driver, Timeout).Until(ExpectedConditions.TextToBePresentInElement(firstCell, "99"));
            
            IdHeader.Click();
            new WebDriverWait(Driver, Timeout).Until(ExpectedConditions.TextToBePresentInElement(firstCell, "1"));

            Assert.AreEqual("1", firstCell.Text);

            Field0Header.Click();

            new WebDriverWait(Driver, Timeout).Until(ExpectedConditions.TextToBePresentInElement(secondCell, "Item 99 Field0"));

            Assert.AreEqual("Item 99 Field0", secondCell.Text);
        }
    }
}
