import { ofType } from "redux-observable";
import { switchMap, map, catchError } from "rxjs/operators";
import { from, of } from "rxjs";
import { setResults } from "../slices/searchSlice";
import { fetchPlaces } from "../../../api/index";

const searchEpic = (action$:any) => action$.pipe(
    ofType("search/fetch"),
    switchMap((action:any) =>
      from(fetchPlaces(action.payload)).pipe(
        map((response) => setResults(response.data.predictions)),
        catchError((error) => of({ type: "search/error", payload: error.message }))
      )
    )
  );

export const rootEpic = searchEpic;