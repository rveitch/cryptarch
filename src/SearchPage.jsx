import * as React from "react";
import * as _ from "lodash";

import {
	SearchkitManager, SearchkitProvider,
	SearchBox, RefinementListFilter, MenuFilter,
	Hits, HitsStats, NoHits, Pagination, SortingSelector,
	SelectedFilters, ResetFilters, ItemHistogramList,
	Layout, LayoutBody, LayoutResults, TopBar,
	SideBar, ActionBar, ActionBarRow, RangeFilter, CheckboxFilter, SearchkitComponent, TermQuery, FilteredQuery, BoolShould, BoolMust
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
      filter:BoolShould([
        TermQuery("tierType", "6"),
        TermQuery("tierTypeName", "Exotic")
      ])
    }))
  })*/

const MovieHitsGridItem = (props)=> {
  const {bemBlocks, result} = props
	let url = "https://www.bungie.net/en/Armory/Detail?type=item&item=" + result._source.itemHash
  let thumb = "http://" + result._source.icon
	let img = (thumb == "http://null") ? "http://www.inforum.com/sites/all/themes/inforum_theme/images/touch-icon.png":"https://www.bungie.net" + result._source.icon
  const source:any = _.extend({}, result._source, result.highlight)
  return (
    <div className={bemBlocks.item().mix(bemBlocks.container("item"))} data-qa="hit">
      <a href={url} target="_blank">
        <img data-qa="poster" className={bemBlocks.item("poster")} src={img} width="170" height="170"/>
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
						<div className="cryptarch-logo"><img data-qa="cryptarch-ico" className="top-bar-menu-logo" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/446514/destiny_vendor_icon_sm.png" height="40"/></div>
		        <SearchBox
		          autofocus={true}
		          searchOnChange={true}
							placeholder="Search content..."
		          prefixQueryFields={["itemName^5", "itemDescription", "tierTypeName", "itemTypeName"]}/>
						</TopBar>
			      <LayoutBody>
							<SideBar>
								<MenuFilter
									id="Tier"
									title="Tier"
									field="tierTypeName.raw"
									listComponent={ItemHistogramList}/>
								<CheckboxFilter id="itemtype-weapon" title="Category" label="Weapon" filter={TermQuery("itemType", 3)} />
								<CheckboxFilter id="itemtype-armor" label="Armor" filter={TermQuery("itemType", 2)} />
								<CheckboxFilter id="itemtype-item" label="Item" filter={TermQuery("itemType", 0)} />
								<CheckboxFilter id="itemtype-consumable" label="Consumable" filter={TermQuery("itemType", 9)} />
								<CheckboxFilter id="itemtype-emblem" label="Emblem" filter={TermQuery("itemType", 14)} />
								<CheckboxFilter id="itemtype-engram" label="Engram" filter={TermQuery("itemType", 8)} />
								<CheckboxFilter id="itemtype-currency" label="Currency" filter={TermQuery("itemType", 1)} />
								<CheckboxFilter id="itemtype-material-exchange" label="Material Exchange" filter={TermQuery("itemType", 10)} />
								<CheckboxFilter id="itemtype-bounty" label="Bounty" filter={TermQuery("itemType", 4)} />
								<CheckboxFilter id="itemtype-completed-bounty" label="Completed  Bounty" filter={TermQuery("itemType", 5)} />
								<CheckboxFilter id="itemtype-bounty-reward" label="Bounty Reward" filter={TermQuery("itemType", 6)} />
								<CheckboxFilter id="itemtype-quest-step" label="Quest Step" filter={TermQuery("itemType", 12)} />
								<CheckboxFilter id="itemtype-mission-reward" label="Mission Reward" filter={TermQuery("itemType", 11)} />
								<CheckboxFilter id="itemtype-message" label="Message" filter={TermQuery("itemType", 7)} />
								<RefinementListFilter
									id="item-type-name"
									title="Type"
									field="itemTypeName.raw"
									size={20}/>
							</SideBar>
			        <LayoutResults>
		          <ActionBar>
		            <ActionBarRow>
		              <HitsStats/>
									<SortingSelector options={[
										{label:"Relevance:", field:"_score", order:"desc", defaultOption:true}
									]}/>
		            </ActionBarRow>
		            <ActionBarRow>
		              <SelectedFilters/>
		              <ResetFilters/>
		            </ActionBarRow>
		          </ActionBar>
		          <Hits mod="sk-hits-grid" hitsPerPage={10} itemComponent={MovieHitsGridItem} />
		          <NoHits/>
							<Pagination showNumbers={true}/>
		        </LayoutResults>
		      </LayoutBody>
		    </Layout>
		  </SearchkitProvider>
		)
	}
}
