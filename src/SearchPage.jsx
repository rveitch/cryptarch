import * as React from "react";
import * as _ from "lodash";

import {
	SearchkitManager, SearchkitProvider,
	SearchBox, RefinementListFilter, MenuFilter,
	Hits, HitsStats, NoHits, Pagination, SortingSelector,
	SelectedFilters, ResetFilters, ItemHistogramList,
	Layout, LayoutBody, LayoutResults, TopBar,
	SideBar, ActionBar, ActionBarRow, RangeFilter, CheckboxFilter, SearchkitComponent, TermQuery, FilteredQuery, BoolShould, BoolMust, Select, Tabs, PageSizeSelector
} from "searchkit";

require("./index.scss");

const host = "https://3590b9d403c87e0697b6:8c2e5209a1@f08f4b1b.qb0x.com:30242/cryptarch"
const searchkit = new SearchkitManager(host, {
	searchOnLoad: true,
	useHistory: false,
  basicAuth:"3590b9d403c87e0697b6:8c2e5209a1"
})
//var Hits = Searchkit.Hits;

/*searchkit.addDefaultQuery((query)=> {
    return query.addQuery(FilteredQuery({
      filter:BoolMust([
        TermQuery("itemType", 3),
				TermQuery("sourceHashes", 24296771)
      ])
    }))
  })*/

const MovieHitsGridItem = (props)=> {
  const {bemBlocks, result} = props
	let url = "https://www.bungie.net/en/Armory/Detail?type=item&item=" + result._source.itemHash
	let icon = result._source.icon
	let img = (icon) ? 'https://www.bungie.net' + icon : 'https://www.bungie.net' + '/img/misc/missing_icon.png'
  const source:any = _.extend({}, result._source, result.highlight)
  return (
    <div className={bemBlocks.item().mix(bemBlocks.container("item"))} data-qa="hit">
      <a href={url} target="_blank">
        <img data-qa="poster" className={bemBlocks.item("poster")} src={img} width="96" height="96"/>
        <div data-qa="title" className={bemBlocks.item("title")} dangerouslySetInnerHTML={{__html:source.itemName}}>
        </div>
      </a>
    </div>
  )
}

export class SearchPage extends React.Component {
	render(){
		return (
			<SearchkitProvider searchkit={searchkit}>
		    <Layout>
		      <TopBar>
						<div className="cryptarch-logo"><img data-qa="cryptarch-ico" className="top-bar-menu-logo" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/446514/destiny_vendor_icon___cryptarch_40px.png" height="40"/></div>
		        <SearchBox
		          autofocus={true}
		          searchOnChange={true}
							placeholder="Search content..."
		          prefixQueryFields={["itemName^5", "itemDescription", "tierTypeName", "itemTypeName"]}/>
						</TopBar>
			      <LayoutBody>
							<SideBar>
								<CheckboxFilter id="itemtype-weapon" title="Category" label="Weapon" filter={TermQuery("itemType", 3)} />
								<CheckboxFilter id="itemtype-armor" title="" label="Armor" filter={TermQuery("itemType", 2)} />
								<CheckboxFilter id="itemtype-item" title="" label="Item" filter={TermQuery("itemType", 0)} />
								<CheckboxFilter id="itemtype-consumable" title="" label="Consumable" filter={TermQuery("itemType", 9)} />
								<CheckboxFilter id="itemtype-emblem" title="" label="Emblem" filter={TermQuery("itemType", 14)} />
								<CheckboxFilter id="itemtype-engram" title="" label="Engram" filter={TermQuery("itemType", 8)} />
								<CheckboxFilter id="itemtype-currency" title="" label="Currency" filter={TermQuery("itemType", 1)} />
								<CheckboxFilter id="itemtype-material-exchange" title="" label="Material Exchange" filter={TermQuery("itemType", 10)} />
								<CheckboxFilter id="itemtype-bounty" title="" label="Bounty" filter={TermQuery("itemType", 4)} />
								<CheckboxFilter id="itemtype-completed-bounty" title="" label="Completed  Bounty" filter={TermQuery("itemType", 5)} />
								<CheckboxFilter id="itemtype-bounty-reward" title="" label="Bounty Reward" filter={TermQuery("itemType", 6)} />
								<CheckboxFilter id="itemtype-quest-step" title="" label="Quest Step" filter={TermQuery("itemType", 12)} />
								<CheckboxFilter id="itemtype-mission-reward" title="" label="Mission Reward" filter={TermQuery("itemType", 11)} />
								<CheckboxFilter id="itemtype-message" title="" label="Message" filter={TermQuery("itemType", 7)} />
								<MenuFilter field={"tierTypeName.raw"} title="Rarity" id="select-tier" listComponent={Select} />
								<MenuFilter field={"itemTypeName.raw"} title="Item Type" id="select-type" listComponent={Select} />
								<CheckboxFilter id="itemtype-primary" title="Weapon Category" label="Primary Weapons" filter={TermQuery("bucketTypeHash", 1498876634)} />
								<CheckboxFilter id="itemtype-special" title="" label="Special Weapons" filter={TermQuery("bucketTypeHash", 2465295065)} />
								<CheckboxFilter id="itemtype-heavy" title="" label="Heavy Weapons" filter={TermQuery("bucketTypeHash", 953998645)} />
								<CheckboxFilter id="source-roi" title="Source" label="Rise of Iron" filter={TermQuery("sourceHashes", 24296771)} />
								<CheckboxFilter id="source-ttk" title="" label="The Taken King" filter={TermQuery("sourceHashes", 460228854)} />
								<CheckboxFilter id="source-quest" title="" label="Quest" filter={TermQuery("sourceHashes", 1920307024)} />
								<CheckboxFilter id="exclude-y1" title="" label="Exclude Y1" filter={
								  BoolShould([
								    TermQuery("sourceHashes", 460228854),
								    TermQuery("sourceHashes", 1920307024)
								  ])} />
							</SideBar>
			        <LayoutResults>
		          <ActionBar>
		            <ActionBarRow>
		              <HitsStats/>
									<PageSizeSelector options={[5, 10, 14, 20, 28, 30, 42, 50, 56, 100]} listComponent={Select}/>
									<SortingSelector options={[
										{label:"Relevance", field:"_score", order:"desc", defaultOption:true},
										{label:"Hash ID (Newest)", field:"itemHash", order:"desc"},
										{label:"Hash ID (Oldest)", field:"itemHash", order:"asc"}
									]}/>
		            </ActionBarRow>
		            <ActionBarRow>
		              <SelectedFilters/>
		              <ResetFilters/>
		            </ActionBarRow>
		          </ActionBar>
		          <Hits mod="sk-hits-grid" hitsPerPage={20} itemComponent={MovieHitsGridItem} />
		          <NoHits/>
							<Pagination showNumbers={true}/>
		        </LayoutResults>
		      </LayoutBody>
		    </Layout>
		  </SearchkitProvider>
		)
	}
}
