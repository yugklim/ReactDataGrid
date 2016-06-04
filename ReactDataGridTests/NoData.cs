using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using NUnit.Framework;
using NUnit.Framework.Internal;

namespace ReactDataGridTests
{
    [TestFixture]
    public class NoData: Base
    {
        [Test]
        public void NoData_Displayed_When_Clicked_On_GotoMinus999Page()
        {
            GoToMinus999PageButton.Click();

            TestNoDataMessagePresence();
        }
    }
}
